import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export function validateRequest(schema: ZodObject) {
  return (request: Request, response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request.body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return response.status(400).json({ errors });
    }

    request.body = parsed.data;
    return next();
  };
}
