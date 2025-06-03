import express from 'express';
import { createTransaction, getTransactions, deleteTransaction, getTransactionSummary } from '../controller/transactionsController.js';

const transactionRoute = express.Router();

transactionRoute.post('/create', createTransaction);
transactionRoute.get('/', getTransactions);
transactionRoute.get('/summary', getTransactionSummary); 
transactionRoute.delete('/', deleteTransaction);
export default transactionRoute;