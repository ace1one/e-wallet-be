import { sql } from "../../config/db.js";
import { successResponse,errorResponse } from '../../utils/responseUtils.js';

const GROUP_TYPES = ['home', 'trip', 'couple', 'others'];

export async function createGroup(req, res) {
    const { name, type, userIds, createdBy } = req.body;
  
    // Validate inputs
    if (!name || !type || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    if (!GROUP_TYPES.includes(type)) {
      return res.status(400).json({ message: `Invalid group type. Allowed: ${GROUP_TYPES.join(", ")}` });
    }

    try {
        // Start manual transaction
    await sql`BEGIN`;

    // Insert group
    const [group] = await sql`
      INSERT INTO groups (name, type, created_by)
      VALUES (${name}, ${type}, ${createdBy})
      RETURNING id, name, type
    `;

    // Insert members
    const values = uniqueUserIds.map(userId => sql`(${group.id}, ${userId})`);

    await sql`
      INSERT INTO group_members (group_id, user_id)
      VALUES ${sql.join(values, sql`, `)}
    `;

    // Commit transaction
    await sql`COMMIT`;

    res.status(201).json({
      message: "Group created successfully",
      group: {
        id: group.id,
        name: group.name,
        type: group.type,
        members: uniqueUserIds
      }
    });

    
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Server error" });
        return errorResponse(res,"Server error")
    }

}
