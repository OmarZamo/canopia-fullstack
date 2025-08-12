import { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { list, get, create, update, remove } from './product.controller';
import { createProductSchema, updateProductSchema } from './product.schemas';

export const productRouter = Router();
productRouter.use(auth);
productRouter.get('/', list);
productRouter.get('/:id', get);
productRouter.post('/', validate(createProductSchema), create);
productRouter.put('/:id', validate(updateProductSchema), update);
productRouter.delete('/:id', remove);
