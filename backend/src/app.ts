import 'reflect-metadata';
import 'express-async-errors';
import './container';

import express from 'express';
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes'
import { errorHandler } from './middlewares/errorHandler.middleware';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use(errorHandler);


export default app;
