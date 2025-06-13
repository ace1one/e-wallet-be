// routes/clerkWebhookRoute.js
import express from 'express';
import { sql } from '../config/db.js';

const router = express.Router();

router.post('/webhook', express.json(), async (req, res) => {
  const event = req.body;

  // Handle user.created
  if (event.type === 'user.created') {
    const user = event.data;

    const {
      id: clerk_id,
      username,
      email_addresses,
      first_name,
      last_name,
    } = user;

    const email = email_addresses[0]?.email_address || '';
    const name = `${first_name || ''} ${last_name || ''}`.trim();
    const isActive = email_addresses[0]?.verification?.status === 'verified';

    try {
      await sql`
        INSERT INTO users (clerk_id, username, email, name, is_active)
        VALUES (${clerk_id}, ${username}, ${email}, ${name}, ${isActive})
        ON CONFLICT (clerk_id) DO NOTHING
      `;
      return res.status(200).json({ message: 'User stored' });
    } catch (err) {
      console.error('Error storing user:', err);
      return res.status(500).json({ message: 'DB error' });
    }
  }

  // Handle user.updated (e.g., email verified later)
  else if (event.type === 'user.updated') {
    const user = event.data;
    const isActive = user.email_addresses[0]?.verification?.status === 'verified';

    try {
      await sql`
        UPDATE users
        SET is_active = ${isActive}
        WHERE clerk_id = ${user.id}
      `;
      return res.status(200).json({ message: 'User updated' });
    } catch (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'DB error' });
    }
  }

  // If event is not handled
  return res.status(200).json({ message: 'Event ignored' });
});

export default router;
