import express  from 'express';
import { createCategory, getCategories } from '../controller/categoryController.js';

const categoryRoute = express.Router();
categoryRoute.post('/create', createCategory);
categoryRoute.get('/', getCategories);

export default categoryRoute;