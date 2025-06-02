import { sql } from "../config/db.js";

export async function createUsersTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) UNIQUE,
        address TEXT,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
  }