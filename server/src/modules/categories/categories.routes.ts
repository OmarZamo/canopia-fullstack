import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { list } from './categories.controller';

export const categoriesRouter = Router();
categoriesRouter.use(auth);
categoriesRouter.get('/', list);
