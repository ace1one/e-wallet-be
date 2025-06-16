import { sql } from "../config/db.js";

export async function createGroupExpensesTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS group_expenses (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        description TEXT,
        total_amount NUMERIC(10, 2) NOT NULL,
        paid_by VARCHAR(255) REFERENCES users(clerk_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }