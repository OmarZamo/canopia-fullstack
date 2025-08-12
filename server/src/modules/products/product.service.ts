import { productRepo } from './product.repository';
export const productService = {
  list: () => productRepo.findAll(),
  get: (id: number) => productRepo.findById(id),
  create: (data: any) => productRepo.create(data),
  update: (id: number, data: any) => productRepo.update(id, data),
  remove: (id: number) => productRepo.remove(id)
};
