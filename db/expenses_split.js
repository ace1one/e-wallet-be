import { sql } from "../config/db.js";
export async function createExpenseSplitsTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS expense_splits (
        id SERIAL PRIMARY KEY,
        expense_id INTEGER REFERENCES group_expenses(id) ON DELETE CASCADE,
        user_id VARCHAR(255) REFERENCES users(clerk_id) ON DELETE CASCADE,
        amount NUMERIC(10, 2) NOT NULL
      )
    `;
  }