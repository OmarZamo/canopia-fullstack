import { Request, Response } from 'express';
import { z } from 'zod';
import { login } from './auth.service';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(6)
  })
});

export async function doLogin(req: Request, res: Response) {
  const { username, password } = req.body;
  const result = await login({ username, password });
  res.json(result);
}
