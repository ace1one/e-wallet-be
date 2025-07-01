import { sql } from "../../config/db.js";
import { successResponse,errorResponse } from '../../utils/responseUtils.js';

const GROUP_TYPES = ['home', 'trip', 'couple', 'others'];

export async function createGroup(req, res) {
      const { name, type, userIds, createdBy } = req.body;
  
      if (!name || !type || !Array.isArray(userIds) || userIds.length === 0) {
          return res.status(400).json({ message: "Missing required fields" });
      }
  
      if (!GROUP_TYPES.includes(type)) {
          return res.status(400).json({ message: `Invalid group type. Allowed: ${GROUP_TYPES.join(", ")}` });
      }
  
      const allUserIds = [...userIds, createdBy];
      const uniqueUserIds = [...new Set(allUserIds)];
  
      try {
          await sql`BEGIN`;
  
          const [group] = await sql`
              INSERT INTO groups (name, type, created_by)
              VALUES (${name}, ${type}, ${createdBy})
              RETURNING id, name, type
          `;
  
        // Prepare bulk insert values manually
        const values = uniqueUserIds
            .map(userId => `(${group.id}, '${userId}')`)
            .join(', ');

        // ⚠️ Important: sanitize inputs if they're not safe (e.g., raw text)

        // Bulk insert into group_members
        await sql`INSERT INTO group_members (group_id, user_id) VALUES ${sql.unsafe(values)}`;

  

        const notificationValues = uniqueUserIds
      .map(
        (userId) =>
          `('${userId}', 'GROUP_ADD', 'You were added to group "${name}"', ${group.id})`
      )
      .join(", ");

    await sql`
      INSERT INTO notifications (user_id, type, title, group_id)
      VALUES ${sql.unsafe(notificationValues)}
    `;

          await sql`COMMIT`;
  
          return successResponse(res, {
              message: "Group created successfully",
              group: {
                  id: group.id,
                  name: group.name,
                  type: group.type,
                  members: uniqueUserIds
              }
          });
  
      } catch (error) {
          await sql`ROLLBACK`;
          console.error("Error creating group:", error);
          return errorResponse(res, "Server error");
      }

  }
  export async function groupDetail(req,res){
    const {userId } = req.auth;

    if (!userId) {
        return errorResponse(res, "Unauthorized", 401);
    }

    try {
        const groupRows = await sql`
            SELECT g.id, g.name, g.type
            FROM groups g
            JOIN group_members gm ON g.id = gm.group_id
            WHERE gm.user_id = ${userId}
        `;


        console.log(groupRows)
        const groups = [];

        for (const group of groupRows) {
            const members = await sql`
                SELECT u.id, u.name,u.username,u.email
                FROM users u
                JOIN group_members gm ON gm.user_id = u.clerk_id
                WHERE gm.group_id = ${group.id}
            `;

            const [{ total }] = await sql`
                SELECT COALESCE(SUM(total_amount), 0) AS total
                FROM group_expenses
                WHERE group_id = ${group.id}
            `;

            const [{ paid = 0 }] = await sql`
                SELECT COALESCE(SUM(total_amount), 0) AS paid
                FROM group_expenses
                WHERE group_id = ${group.id} AND paid_by = ${userId}
            `;

            const [{ share = 0 }] = await sql`
                SELECT COALESCE(SUM(amount), 0) AS share
                FROM expense_splits es
                JOIN group_expenses e ON e.id = es.expense_id
                WHERE e.group_id = ${group.id} AND es.user_id = ${userId}
            `;

            const balance = paid - share;

            groups.push({
                id: group.id,
                name: group.name,
                type: group.type,
                members,
                totalExpense: Math.round(Number(total) * 100) / 100,
                yourBalance: Math.round(balance * 100) / 100,
                status:
                  balance > 0
                    ? `You get ₹${Math.round(balance * 100) / 100}`
                    : balance < 0
                    ? `You owe ₹${Math.abs(Math.round(balance * 100) / 100)}`
                    : `Settled up`,
              });
        }

        return successResponse(res, groups, "Groups fetched successfully");
    } catch (error) {
        console.error("Error listing groups:", error);
        return errorResponse(res, "Server error");
    }

  }

