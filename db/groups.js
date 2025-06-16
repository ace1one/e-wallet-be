import { sql } from "../config/db.js";

export async function createGroupsTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        created_by VARCHAR(255) REFERENCES users(clerk_id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }