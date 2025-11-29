import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type RequestSource = "body" | "query" | "params";

export function validateRequest<T extends ZodType>(
  schema: T,
  source: RequestSource = "body"
) {
  return (request: Request, response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request[source]);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return response.status(400).json({ errors });
    }

    if (!request.validated) {
      request.validated = {};
    }

    request.validated[source] = parsed.data;
    return next();
  };
}
