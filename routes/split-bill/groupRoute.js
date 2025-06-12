import express  from 'express';
import { createGroup } from '../../controller/split-bill/groupController';

const groupRoute = express.Router();
groupRoute.post('group/create', createGroup);


export default groupRoute;