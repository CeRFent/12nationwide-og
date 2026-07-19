import Stripe from 'stripe'; // If you want payment integration, otherwise keep it clean

// Optional: Install the twilio SDK if using Option B (npm i twilio)
// import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    name,
    email,
    phone,
    pickupAddress,
    dropoffAddress,
    deliveryDistanceMiles,
    weightCategory,
    estimatedQuote,
    laborSummary,
    wgSummary
  } = req.body;

  // Validate required inputs
  if (!name || !phone || !pickupAddress || !dropoffAddress) {
    return res.status(400).json({ error: 'Missing required shipment details' });
  }

  // Format the message template
  const textMessage = `
🚛 *NEW AUTOMATED LOAD REQUEST*
👤 *Customer:* ${name}
📞 *Phone:* ${phone}
✉️ *Email:* ${email}

📍 *Pickup:* ${pickupAddress}
🏁 *Drop-off:* ${dropoffAddress}

📏 *Distance:* ${deliveryDistanceMiles}
📦 *Weight Category:* ${weightCategory}
🛠️ *Options:* ${laborSummary || 'None'}
👑 *White-Glove:* ${wgSummary || 'None'}

💰 *ESTIMATED QUOTE:* ${estimatedQuote}
  `.trim();

  console.log("Forming WhatsApp API payload:\n", textMessage);

  // =========================================================================
  // OPTION B: TWILIO AUTOMATION (True Push Notification Bot)
  // To activate this, uncomment the blocks below, install twilio ("npm i twilio"),
  // and set your TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_TO in .env
  // =========================================================================
  /*
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioSandboxNumber = 'whatsapp:+14155238886'; // Default Twilio Sandbox sender
  const operatorWhatsAppNumber = process.env.TWILIO_WHATSAPP_TO; // e.g. 'whatsapp:+13862155963'

  if (accountSid && authToken && operatorWhatsAppNumber) {
    try {
      const client = require('twilio')(accountSid, authToken);
      const twilioRes = await client.messages.create({
        from: twilioSandboxNumber,
        to: operatorWhatsAppNumber,
        body: textMessage
      });
      console.log('WhatsApp Bot Message Sent via Twilio:', twilioRes.sid);
    } catch (error) {
      console.error('Twilio WhatsApp error:', error.message);
      // Fallback: we won't crash the frontend request, but log the error
    }
  } else {
    console.log("Twilio environment variables not set. Skipping push notification bot.");
  }
  */

  // For now, we return success and let the client-side window.open(https://wa.me/...) handle the instant redirection.
  return res.status(200).json({
    success: true,
    message: 'Load request logged. WhatsApp webhook is ready for automation.',
    smsPreview: textMessage
  });
}
