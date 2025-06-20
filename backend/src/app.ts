import express from 'express';
import cors from 'cors';
declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());

export default app;