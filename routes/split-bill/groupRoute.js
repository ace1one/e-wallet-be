import express  from 'express';
import { createGroup, groupDetail } from '../../controller/split-bill/groupController.js';

const groupRoute = express.Router();
groupRoute.post('/create', createGroup);
groupRoute.get('/details', groupDetail)


export default groupRoute;