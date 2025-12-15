import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes'
import orderRoutes from './routes/order.routes'
import userRoutes from './routes/user.routes'
import fragranceRoutes from './routes/fragrance.routes'
import pricingConfigRoutes from './routes/pricingConfig.routes'
import 'dotenv/config';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRouter);
app.use('/api/fragrances', fragranceRoutes);
app.use('/api/pricing-configs', pricingConfigRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
