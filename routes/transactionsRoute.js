import express from 'express';
import { createTransaction, getTransactions } from '../controller/transactionsController.js';

const transactionRoute = express.Router();

transactionRoute.post('/create', createTransaction);
transactionRoute.get('/', getTransactions);
export default transactionRoute;