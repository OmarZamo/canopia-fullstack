import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { authRouter } from './modules/auth/auth.routes';
import { productRouter } from './modules/products/product.routes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

app.use(errorHandler);
