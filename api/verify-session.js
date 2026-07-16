import Stripe from 'stripe';

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing Secret Key' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      return res.status(200).json({ 
        success: true, 
        email: session.customer_details?.email 
      });
    } else {
      return res.status(200).json({ 
        success: false, 
        error: 'Payment not completed' 
      });
    }
  } catch (err) {
    console.error('Session Verification Error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
