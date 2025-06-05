import { Router } from 'express';
import transactionsRoutes from './transactionsRoute.js';
import categoryRoutes from './categoryRoute.js';

const router = Router();
// Define the base route for transactions
router.use('/transactions', transactionsRoutes);
router.use('/category', categoryRoutes);
// Add more routes here as needed
// Example: router.use('/users', usersRouter);
// Example: router.use('/categories', categoriesRouter);

export default router;