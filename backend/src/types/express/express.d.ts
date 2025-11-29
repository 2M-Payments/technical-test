declare global {
  namespace Express {
    interface Request {
      userId: string;
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export {};


