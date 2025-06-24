import 'reflect-metadata';
import 'express-async-errors';
import './container';

import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes'
import { errorHandler } from './middlewares/errorHandlerMiddleware';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use(errorHandler);


export default app;
