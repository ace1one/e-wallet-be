import { sql } from '../config/db.js';

export async function createNotificationsTable() {
  // Enable pgcrypto extension (for gen_random_uuid)
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  // Create notifications table
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR(255) NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
      type TEXT NOT NULL,               -- e.g. 'GROUP_ADD'
      title TEXT NOT NULL,
      group_id INTEGER REFERENCES groups(id),
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}
