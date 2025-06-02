import { Router } from 'express';
import transactionsRoutes from './transactionsRoute.js';

const router = Router();
// Define the base route for transactions
router.use('/transactions', transactionsRoutes);
// Add more routes here as needed
// Example: router.use('/users', usersRouter);
// Example: router.use('/categories', categoriesRouter);

export default router;