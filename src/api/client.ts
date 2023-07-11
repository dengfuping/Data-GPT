import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  name: 'connection-hide-passwordHash',
  result: {
    connection: {
      passwordHash: {
        needs: {},
        compute() {
          return undefined;
        },
      },
    },
  },
});

export default prisma;
