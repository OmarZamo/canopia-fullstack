import { categoryRepo } from './categories.repository';

export const categoryService = {
  list: () => categoryRepo.findActive(),
};
