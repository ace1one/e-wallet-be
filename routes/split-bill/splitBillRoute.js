import express  from 'express';
import { createGroupExpenses } from '../../controller/split-bill/splitBillController';


const groupExpenseRoute = express.Router();
groupExpenseRoute.post('/create', createGroupExpenses);



export default groupExpenseRoute;