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

  // Best-effort local file log (works in local/dev; Vercel's production filesystem
  // is read-only, so this silently no-ops in prod — Telegram below is the real channel).
  try {
    const dirPath = path.join(process.cwd(), 'private-assets');
    const filePath = path.join(dirPath, 'subscribers.json');

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

    subscribers.push({
      name: name || 'Anonymous',
      email,
      blueprint: blueprint || 'Unknown',
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Subscriber file log skipped (read-only filesystem in production):', err.message);
  }

  // Durable delivery: notify via Telegram so leads aren't lost when the file write above
  // is unavailable (e.g. Vercel production). Uses the same bot already wired for load requests.
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (telegramToken && telegramChatId) {
    try {
      const text = `📬 *NEW BLUEPRINT SUBSCRIBER*\n\n👤 *Name:* ${name || 'Anonymous'}\n✉️ *Email:* ${email}\n📘 *Blueprint:* ${blueprint || 'Unknown'}`;
      const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramChatId, text, parse_mode: 'Markdown' })
      });
      const tgData = await tgRes.json();
      if (!tgData.ok) {
        console.error('Telegram subscriber notification error:', tgData.description);
      }
    } catch (err) {
      console.error('Failed to dispatch Telegram subscriber notification:', err);
    }
  } else {
    console.log('Telegram Bot environment variables not set — subscriber notification skipped.');
  }

  return res.status(200).json({ success: true, message: 'Subscriber saved successfully' });
}
