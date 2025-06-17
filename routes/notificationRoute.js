import express from 'express';
import { getNotifications, markNotificationRead } from '../controller/notificationController.js';

const notifiactionRoute = express.Router();

notifiactionRoute.get('/', getNotifications);
notifiactionRoute.patch('/read/:id', markNotificationRead);

export default notifiactionRoute;