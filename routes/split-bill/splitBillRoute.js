import express  from 'express';
import { createGroupExpenses } from '../../controller/split-bill/splitBillController.js';


const groupExpenseRoute = express.Router();
groupExpenseRoute.post('/create', createGroupExpenses);



export default groupExpenseRoute;