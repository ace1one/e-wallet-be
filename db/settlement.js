import { sql } from "../config/db.js";
export async function createSettlementTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS settlement (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        from_user_id VARCHAR(255) REFERENCES users(clerk_id),
        to_user_id VARCHAR(255) REFERENCES users(clerk_id),
        amount NUMERIC(10, 2) NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }