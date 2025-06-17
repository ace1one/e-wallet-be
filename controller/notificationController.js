import { sql } from "../config/db.js"; 
import { successResponse,errorResponse } from '../utils/responseUtils.js'


export async function getNotifications(req, res) {
    const { userId } = req.auth;
  
    if (!userId) return errorResponse(res, "Unauthorized", 401);
  
    try {
      const notifications = await sql`
        SELECT id, type, title, group_id, is_read, created_at
        FROM notifications
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
  
      return successResponse(res, notifications, "Notifications fetched");
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return errorResponse(res, "Server error");
    }
  }


  export async function markNotificationRead(req, res) {
    const { id } = req.params;
    const { userId } = req.auth;
  
    if (!userId || !id) return errorResponse(res, "Unauthorized", 401);
  
    try {
      const result = await sql`
        UPDATE notifications
        SET is_read = true
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
  
      if (result.length === 0) {
        return errorResponse(res, "Notification not found", 404);
      }
  
      return successResponse(res, result[0], "Marked as read");
    } catch (error) {
      console.error("Error marking notification read:", error);
      return errorResponse(res, "Server error");
    }
  }
  
  