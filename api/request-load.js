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

  // Format rich message for Telegram / WhatsApp
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

      // If customer attached photos, send photos directly into Telegram Chat!
      if (Array.isArray(photoUrls) && photoUrls.length > 0) {
        for (const pUrl of photoUrls) {
          if (pUrl && pUrl.startsWith('http')) {
            await fetch(`https://api.telegram.org/bot${telegramToken}/sendPhoto`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: telegramChatId,
                photo: pUrl,
                caption: `📷 Photo for Quote #${quoteId}`
              })
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to dispatch Telegram message:', err);
      telegramStatus = `Failed: ${err.message}`;
    }
  } else {
    console.log("ℹ️ Telegram Bot environment variables not set in .env (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID).");
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
