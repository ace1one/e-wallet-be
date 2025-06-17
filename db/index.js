import { createTransactionsTable } from "./transaction.js";
import { createUsersTable  } from "./users.js";
import { createCategoryTable } from "./category.js";
import { createSettlementTable } from "./settlement.js";
import { createExpenseSplitsTable } from "./expenses_split.js";
import { createGroupExpensesTable } from "./group_expenses.js";
import { createGroupMembersTable } from "./group_members.js";
import { createGroupsTable } from "./groups.js";
import { createNotificationsTable } from "./notification.js";

export async function initializeDatabase() {
  try {
    await createUsersTable();
    await createCategoryTable();
    await createTransactionsTable();
    await createGroupsTable();
    await createGroupMembersTable();
    await createGroupExpensesTable();
    await createExpenseSplitsTable();
    await createSettlementTable();
    await createNotificationsTable();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing the database:', error);
    process.exit(1);
  }
}