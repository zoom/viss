import { Prisma, PrismaClient } from "@prisma/client";

const extendedPrismaClient = () => {
  const prisma = new PrismaClient();

  prisma.$use(async (params, next) => {

    if (params.model !== Prisma.ModelName.Rule) {
      // Soft-delete for every model except Rule
      if (params.action === 'delete') {
        params.action = 'update';
        params.args['data'] = { 
          deletedAt: new Date(),
          deleted: true
        };    
      }
    }
  
    return next(params);
  })

  const xPrisma = prisma.$extends({
    model: {
      $allModels: {
        async touch<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where']
        ) {
          const ctx = Prisma.getExtensionContext(this);
          const row = await (ctx as any).findFirst({ where });
          
          await (ctx as any).update({
            data: {
              id: row['id']
            },
            where: {
              id: row['id']
            }
          });
        },
        async exists<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where']
        ): Promise<boolean> {
          const ctx = Prisma.getExtensionContext(this)
          const row = await (ctx as any).findFirst({ where })
          return row !== null
        },
      },
    }
  });

  return xPrisma;
};

export const database: ReturnType<typeof extendedPrismaClient> = extendedPrismaClient();

export default database;