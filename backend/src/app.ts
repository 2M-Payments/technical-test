import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
