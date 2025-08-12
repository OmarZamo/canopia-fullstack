import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate =
  (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!parsed.success) {
      const issues = parsed.error.issues.map((i: z.ZodIssue) => ({
        path: i.path.join('.'),
        message: i.message
      }));
      return res.status(400).json({ message: 'Validation error', issues });
    }

    next();
  };
