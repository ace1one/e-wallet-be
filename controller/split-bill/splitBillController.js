import { sql } from "../config/db.js"; 
import { successResponse, errorResponse } from '../utils/responseUtils.js';

export const createGroupExpenses = async (req, res) => {
  const { userId } = req.auth;
  const { groupId, title, amount, selectedUsers } = req.body;

  if (!userId) {
    return errorResponse(res, 401, "Unauthorized");
  }

  if (!groupId || !title || !amount || !selectedUsers || selectedUsers.length === 0) {
    return errorResponse(res, 400, "Missing required fields");
  }

  try {
    // Insert the expense into the group_expenses table
    const [expense] = await sql`
      INSERT INTO group_expenses (group_id, title, total_amount, paid_by)
      VALUES (${groupId}, ${title}, ${amount}, ${userId})
      RETURNING *
    `;

    // Insert each user's split using provided amount
    const splitPromises = selectedUsers.map(({ userId, amount }) =>
      sql`
        INSERT INTO expense_splits (expense_id, user_id, amount)
        VALUES (${expense.id}, ${userId}, ${amount})
      `
    );

    await Promise.all(splitPromises);

    return successResponse(res, 201, "Expense created successfully", { expense });
  } catch (error) {
    console.error("Error creating expense:", error);
    return errorResponse(res, 500, "Server error");
  }
};
