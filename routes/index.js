import { Router } from 'express';
import  clerkMiddleware  from '../middleware/clerkMiddleware.js';
import transactionsRoutes from './transactionsRoute.js';
import categoryRoutes from './categoryRoute.js';
import groupRoute from './split-bill/groupRoute.js';
import notifiactionRoute from './notificationRoute.js';

const router = Router();

router.use(clerkMiddleware);
router.use('/transactions', transactionsRoutes);
router.use('/category', categoryRoutes);
router.use('/group',groupRoute)
router.use('/notification',notifiactionRoute)


export default router;