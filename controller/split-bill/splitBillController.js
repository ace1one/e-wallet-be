// import { sql } from "../config/db.js"; 
// import { successResponse,errorResponse } from '../utils/responseUtils.js'


// export const createGroup = async (req, res) => {
//     const { name, type,user_id, members } = req.body;

//     if (!name || !type || !user_id || !members) {
//         return errorResponse(res, 'Missing required fields', 400);
//     }

//     try {
//         const result = await sql`
//             INSERT INTO group (name,type, user_id,meme)
//             VALUES (${name}, ${icon}, ${status}, ${description}, ${user_id})
//             RETURNING *
//         `;
//         return successResponse(res, result[0], 'Category created successfully', 201);
//     } catch (error) {
//         console.error('Error creating category:', error);
//         return errorResponse(res, 'Internal Server Error');
//     }
// }

// export const getCategories = async (req, res) => {
//     try {
//         const result = await sql`SELECT * FROM category`;
//         return successResponse(res, result, 'Categories fetched successfully');
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//         return errorResponse(res, 'Internal Server Error');
//     }
// }

// export const deleteCategory = async (req, res) => {
//     const { userId ,id} = req.query;

//     if (!id) {
//         return errorResponse(res, 'Category not found', 400);
//     }

//     try {
//         const result = await sql`
//             DELETE FROM category
//             WHERE user_id = ${userId} AND
//             id = ${id}
//             RETURNING *
//         `;
        
//         if (result.length === 0) {
//             return errorResponse(res, 'Category not found', 404);
//         }

//         return successResponse(res, result[0], 'Category deleted successfully');
//     } catch (error) {
//         console.error('Error deleting category:', error);
//         return errorResponse(res, 'Internal Server Error');
//     }
// }