import Stripe from 'stripe';

export default async function handler(req, res) {
  console.log('Checkout API request received');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY');
    return res.status(500).json({ error: 'Server configuration error: Missing Secret Key' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method === 'POST') {
    try {
      console.log('Creating checkout session for price:', process.env.VITE_STRIPE_PRICE_ID);
      
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded_page',
        line_items: [
          {
            price: process.env.VITE_STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: 'payment',
        return_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      });

      console.log('Session created successfully:', session.id);
      res.status(200).json({ clientSecret: session.client_secret });
    } catch (err) {
      console.error('Stripe Session Error Details:', {
        message: err.message,
        type: err.type,
        code: err.code,
        param: err.param,
        statusCode: err.statusCode
      });
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
