import express  from 'express';
import { users } from '../controller/users/usersController.js';

const userRoute = express.Router();
userRoute.get('/', users);

export default userRoute;