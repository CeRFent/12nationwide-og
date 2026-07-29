import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    quoteNumber,
    name,
    email,
    phone,
    pickupAddress,
    dropoffAddress,
    deliveryDistanceMiles,
    service,
    vehicle,
    deliveryTeam,
    estimatedQuote,
    laborSummary,
    items,
    photoUrls
  } = req.body || {};

  // Validate required inputs
  if (!name || !phone || !pickupAddress || !dropoffAddress) {
    return res.status(400).json({ error: 'Missing required shipment details' });
  }

  const quoteId = quoteNumber || `12N-${Date.now().toString().slice(-6)}`;

  // Format rich message for Telegram & WhatsApp
  const textMessage = `
🚛 *NEW 12 NATIONWIDE LOAD REQUEST*
🆔 *Quote #:* ${quoteId}

👤 *Customer:* ${name}
📞 *Phone:* ${phone}
✉️ *Email:* ${email || 'N/A'}

📍 *Pickup:* ${pickupAddress}
🏁 *Drop-off:* ${dropoffAddress}

📦 *Service:* ${service || 'Delivery'}
🚚 *Vehicle:* ${vehicle || 'Standard'}
👥 *Team:* ${deliveryTeam || laborSummary || 'Driver Only'}
📏 *Distance:* ${deliveryDistanceMiles || 'N/A'}

💰 *ESTIMATED QUOTE:* ${estimatedQuote || 'Pending'}
  `.trim();

  console.log("==========================================");
  console.log("Forming Load Alert Notification:\n", textMessage);
  console.log("==========================================");

  // 1. TELEGRAM BOT NOTIFICATION DISPATCH (Free Rich Push to iPhone)
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  let telegramStatus = 'Skipped (No Telegram Token in .env)';

  if (telegramToken && telegramChatId) {
    try {
      const adminAppUrl = process.env.VITE_APP_URL ? `${process.env.VITE_APP_URL}/admin` : 'https://12nationwide.it.com/admin';

      // Send Telegram Text Message with Inline Button
      const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: textMessage,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📱 Open Admin App', url: adminAppUrl }
              ]
            ]
          }
        })
      });

      const tgData = await tgRes.json();
      if (tgData.ok) {
        console.log('✅ Telegram Notification sent to iPhone successfully!');
        telegramStatus = 'Sent';
      } else {
        console.error('❌ Telegram Bot API Error:', tgData.description);
        telegramStatus = `Error: ${tgData.description}`;
      }

      // Send Customer Uploaded Item Photos to Telegram Chat (Supports HTTP URLs & base64 Data URLs)
      if (Array.isArray(photoUrls) && photoUrls.length > 0) {
        for (let i = 0; i < photoUrls.length; i++) {
          const pUrl = photoUrls[i];
          if (!pUrl) continue;

          if (pUrl.startsWith('http://') || pUrl.startsWith('https://')) {
            // Direct Public URL Send
            await fetch(`https://api.telegram.org/bot${telegramToken}/sendPhoto`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: telegramChatId,
                photo: pUrl,
                caption: `📷 Photo #${i + 1} for Quote #${quoteId}`
              })
            });
          } else if (pUrl.startsWith('data:image')) {
            // Base64 Data URL multipart upload to Telegram
            try {
              const base64Data = pUrl.split(',')[1];
              const buffer = Buffer.from(base64Data, 'base64');
              const formData = new FormData();
              formData.append('chat_id', telegramChatId);
              formData.append('caption', `📷 Photo #${i + 1} for Quote #${quoteId}`);
              formData.append('photo', new Blob([buffer], { type: 'image/jpeg' }), `item_photo_${i + 1}.jpg`);

              await fetch(`https://api.telegram.org/bot${telegramToken}/sendPhoto`, {
                method: 'POST',
                body: formData
              });
              console.log(`✅ Base64 photo #${i + 1} dispatched to Telegram!`);
            } catch (pErr) {
              console.error('Failed to parse base64 photo for Telegram:', pErr);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to dispatch Telegram message:', err);
      telegramStatus = `Failed: ${err.message}`;
    }
  } else {
    console.log("ℹ️ Telegram Bot environment variables not set in .env.");
  }

  // 2. TWILIO WHATSAPP BACKUP (If credentials present)
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const operatorWhatsAppNumber = process.env.TWILIO_WHATSAPP_TO;
  let twilioStatus = 'Skipped';

  if (accountSid && authToken && operatorWhatsAppNumber) {
    try {
      const client = twilio(accountSid, authToken);
      const formattedTo = operatorWhatsAppNumber.startsWith('whatsapp:')
        ? operatorWhatsAppNumber
        : `whatsapp:${operatorWhatsAppNumber}`;

      const twilioRes = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
        to: formattedTo,
        body: textMessage
      });
      console.log('✅ WhatsApp Message Sent via Twilio SID:', twilioRes.sid);
      twilioStatus = 'Sent';
    } catch (error) {
      console.error('❌ Twilio WhatsApp error:', error.message);
      twilioStatus = `Failed: ${error.message}`;
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Load request processed.',
    telegramStatus,
    twilioStatus,
    textMessage
  });
}
