import { sql } from "../config/db.js";

export async function createCategoryTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status BOOLEAN NOT NULL DEFAULT TRUE,
        description TEXT,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
  }