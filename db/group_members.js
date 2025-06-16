import { sql } from "../config/db.js";

export async function createGroupMembersTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        user_id VARCHAR(255) REFERENCES users(clerk_id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_id, user_id)
      )
    `;
  }