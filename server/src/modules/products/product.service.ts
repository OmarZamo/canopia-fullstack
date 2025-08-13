import { prisma } from '../../db/prisma';
import { productRepo } from './product.repository';

async function ensureCategoryExists(category_id?: number | null) {
  if (category_id == null) return;
  const found = await prisma.categories.findUnique({ where: { id: category_id } });
  if (!found || found.status !== 1) {
    throw { status: 400, message: 'category_id inválido o inactivo' };
  }
}

export const productService = {
  list: () => productRepo.findAll(),
  get: (id: number) => productRepo.findById(id),
  create: async (data: any) => {
    await ensureCategoryExists(data.category_id);
    return productRepo.create(data);
  },
  update: async (id: number, data: any) => {
    await ensureCategoryExists(data.category_id);
    return productRepo.update(id, data);
  },
  remove: (id: number) => productRepo.remove(id)
};
