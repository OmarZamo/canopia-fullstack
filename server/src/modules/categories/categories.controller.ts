import { Request, Response } from 'express';
import { categoryService } from './categories.service';

export async function list(_req: Request, res: Response) {
  const rows = await categoryService.list();
  res.json(rows);
}
