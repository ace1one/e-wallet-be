import { sql } from "../config/db.js"; 
import { successResponse,errorResponse } from '../utils/responseUtils.js'

export const createTransaction = async (req, res) => {
    const { user_id, category_id, title, amount, remarks } = req.body;

    if (!user_id || !category_id || !title || amount === undefined || amount === null) {
        return errorResponse(res,'Missing Fields',400)  //res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await sql`
            INSERT INTO transactions (user_id, category_id, title, amount, remarks)
            VALUES (${user_id}, ${category_id}, ${title}, ${amount}, ${remarks})
            RETURNING *
        `;
        return successResponse(res, result[0], 'Transaction created successfully', 201);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return errorResponse(res, 'Internal Server Error');
    }
}

export const getTransactions = async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'Missing required field: user_id' });
    }

    try {
        const result = await sql`
            SELECT * FROM transactions
            WHERE user_id = ${user_id}
            ORDER BY created_at DESC
        `;
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}