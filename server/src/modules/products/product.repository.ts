import { prisma } from '../../db/prisma';
export const productRepo = {
  findAll: () => prisma.products.findMany({ where: { status: 1 } }),
  findById: (id: number) => prisma.products.findUnique({ where: { id } }),
  create: (data: any) => prisma.products.create({ data }),
  update: (id: number, data: any) => prisma.products.update({ where: { id }, data }),
  remove: (id: number) => prisma.products.update({ where: { id }, data: { status: 0 } })
};
