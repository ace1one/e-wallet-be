import { sql } from "../config/db.js";

export async function createTransactionsTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES category(id) ON DELETE SET NULL,
        type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        remarks TEXT,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
  }