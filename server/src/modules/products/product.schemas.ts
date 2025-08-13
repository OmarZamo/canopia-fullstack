import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'name es requerido'),
    description: z.string().optional(),
    price: z.coerce.number().positive('price debe ser > 0'),
    stock: z.coerce.number().int().nonnegative('stock no puede ser negativo'),
    category_id: z.coerce.number().int('category_id es requerido'),
    status: z.coerce.number().int().min(0).max(1).optional()
  })
});


export const updateProductSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    name: z.string().min(1, 'name es requerido'),
    description: z.string().optional(),
    price: z.coerce.number().positive('price debe ser > 0'),
    stock: z.coerce.number().int().nonnegative('stock no puede ser negativo'),
    category_id: z.coerce.number().int('category_id es requerido'),
    status: z.coerce.number().int().min(0).max(1).optional()
  })
});
