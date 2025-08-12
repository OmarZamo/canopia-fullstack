import { Request, Response } from 'express';
import { productService } from './product.service';

export async function list(_req: Request, res: Response) { res.json(await productService.list()); }
export async function get(req: Request, res: Response) {
  const item = await productService.get(Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}
export async function create(req: Request, res: Response) {
  const saved = await productService.create(req.body);
  res.status(201).json(saved);
}
export async function update(req: Request, res: Response) {
  const saved = await productService.update(Number(req.params.id), req.body);
  res.json(saved);
}
export async function remove(req: Request, res: Response) {
  await productService.remove(Number(req.params.id));
  res.status(204).send();
}
