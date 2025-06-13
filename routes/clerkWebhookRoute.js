import express from 'express';
import { Webhook } from 'svix'; 
import { sql } from '../config/db.js';

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    // Verify webhook signature
    try {
        const svix = new Webhook(webhookSecret);
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };
        const payload = req.body.toString();
        svix.verify(payload, headers); // Throws if verification fails
        const event = JSON.parse(payload);
        console.log('[Webhook] Event:', event.type);

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
                console.log('[Webhook] User stored:', clerk_id);
                return res.status(200).json({ message: 'User stored' });
            } catch (err) {
                console.error('[Webhook] Error storing user:', err);
                return res.status(500).json({ message: 'DB error' });
            }
        }

        // Handle user.updated
        else if (event.type === 'user.updated') {
            const user = event.data;
            const isActive = user.email_addresses[0]?.verification?.status === 'verified';

            try {
                await sql`
                    UPDATE users
                    SET is_active = ${isActive}
                    WHERE clerk_id = ${user.id}
                `;
                console.log('[Webhook] User updated:', user.id);
                return res.status(200).json({ message: 'User updated' });
            } catch (err) {
                console.error('[Webhook] Error updating user:', err);
                return res.status(500).json({ message: 'DB error' });
            }
        }

        // Unhandled event
        console.log('[Webhook] Ignored event:', event.type);
        return res.status(200).json({ message: 'Event ignored' });
    } catch (err) {
        console.error('[Webhook] Verification error:', err);
        return res.status(400).json({ message: 'Webhook verification failed' });
    }
});

export default router;