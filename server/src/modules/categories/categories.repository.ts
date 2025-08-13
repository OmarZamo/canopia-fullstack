import { prisma } from '../../db/prisma';

export const categoryRepo = {
  findActive: () =>
    prisma.categories.findMany({
      where: { status: 1 },
      select: { id: true, name: true }
    })
};
