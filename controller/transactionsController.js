import { sql } from "../config/db.js"; 
import { successResponse,errorResponse } from '../utils/responseUtils.js'

export const createTransaction = async (req, res) => {
    const { user_id, category_id, type ,title, amount, remarks } = req.body;

    if (!user_id || !category_id || !type || !title || amount === undefined || amount === null) {
        return errorResponse(res,'Missing Fields',400)  //res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const result = await sql`
            INSERT INTO transactions (user_id, category_id,type, title, amount, remarks)
            VALUES (${user_id}, ${category_id}, ${type} ,${title}, ${amount}, ${remarks})
            RETURNING *
        `;
        return successResponse(res, result[0], 'Transaction created successfully', 201);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return errorResponse(res, 'Internal Server Error');
    }
}

export const getTransactions = async (req, res) => {
    const { userId } = req.auth;

    if (!userId) {
        return res.status(400).json({ error: 'Missing required field: user_id' });
    }

    try {
        const result = await sql`
            SELECT t.*, c.name as category 
            FROM transactions t 
            JOIN category c ON t.category_id = c.id 
            WHERE t.user_id = ${userId}
            ORDER BY t.id DESC
        `;
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getTransactionSummary = async (req, res) => {
    console.log('user',req.auth)
    const { userId } = req.auth;

    if (!userId) {
        return res.status(400).json({ error: 'Missing required field: user_id' });
    }

    try {
       const balanceResult = await sql`
            SELECT COALESCE(SUM(
            CASE 
                WHEN type = 'income' THEN amount
                WHEN type = 'expense' THEN -amount
                ELSE 0
            END
            ), 0) AS balance
            FROM transactions
            WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS income
            FROM transactions
            WHERE user_id = ${userId} AND type = 'income'
        `;

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS expenses
            FROM transactions
            WHERE user_id = ${userId} AND type = 'expense'
        `;
        
        res.status(200).json(
            {
                balance: balanceResult[0].balance,
                income: incomeResult[0].income,
                expenses: expenseResult[0].expenses
            }
        );
    } catch (error) {
        console.error('Error fetching transaction summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteTransaction = async (req, res) => {
    const { transactionId } = req.query;
    const { userId } = req.auth;

    if (!transactionId) {
        return res.status(400).json({ error: 'Missing required field: transactionId' });
    }

    try {
        const result = await sql`
            DELETE FROM transactions
            WHERE id = ${transactionId}
            AND user_id = ${userId}
            RETURNING *
        `;
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully', transaction: result[0] });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}