import express  from 'express';
import { createGroup } from '../../controller/split-bill/groupController.js';

const groupRoute = express.Router();
groupRoute.post('/create', createGroup);


export default groupRoute;