import { Router } from 'express';
import { doLogin, loginSchema } from './auth.controller';
import { validate } from '../../middlewares/validate';

export const authRouter = Router();
authRouter.post('/login', validate(loginSchema), doLogin);
