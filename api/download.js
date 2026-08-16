import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

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
    
    if (session.payment_status !== 'paid') {
      return res.status(403).json({ error: 'Access Denied: Payment not verified' });
    }

    // Path to the private asset
    const filePath = path.join(process.cwd(), 'private-assets', 'Driver Income Blueprint Ebook.pptx.pdf');

    if (!fs.existsSync(filePath)) {
      console.error('Ebook file not found at path:', filePath);
      return res.status(404).json({ error: 'Ebook file not found' });
    }

    // Read the file stats to get file size
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="Vehicle_Income_Blueprint.pdf"',
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (err) {
    console.error('Download Verification Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
