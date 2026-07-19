import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, blueprint } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const dirPath = path.join(process.cwd(), 'private-assets');
    const filePath = path.join(dirPath, 'subscribers.json');

    // Create private-assets directory if not exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let subscribers = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      try {
        subscribers = JSON.parse(fileData);
      } catch (e) {
        subscribers = [];
      }
    }

    // Append new subscriber
    subscribers.push({
      name: name || 'Anonymous',
      email,
      blueprint: blueprint || 'Unknown',
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');

    return res.status(200).json({ success: true, message: 'Subscriber saved successfully' });
  } catch (err) {
    console.error('Subscription Endpoint Error:', err);
    return res.status(500).json({ error: 'Failed to process subscription' });
  }
}
