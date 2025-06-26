import { sql } from "../../config/db.js";
export async function users(req, res) {
    const { userId } = req.auth;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const userRows = await sql`
            SELECT  email,username
            FROM users
            WHERE is_active = true
        `;

        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userRows[0];
        return res.status(200).json({ data: userRows });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Server error" });
    }
}