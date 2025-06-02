import { createTransactionsTable } from "./transaction.js";
import { createUsersTable  } from "./users.js";
import { createCategoryTable } from "./category.js";

export async function initializeDatabase() {
  try {
    await createUsersTable();
    await createCategoryTable();
    await createTransactionsTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing the database:', error);
    process.exit(1);
  }
}