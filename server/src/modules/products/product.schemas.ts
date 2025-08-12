import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    stock: z.coerce.number().int().nonnegative(),
    category_id: z.coerce.number().int().optional(),
    status: z.coerce.number().int().min(0).max(1).optional()
  })
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().nonnegative().optional(),
    category_id: z.coerce.number().int().optional(),
    status: z.coerce.number().int().min(0).max(1).optional()
  })
});
