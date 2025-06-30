import { db } from '@/db';
import { agents } from '@/db/schema';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await db.select().from(agents);
    return data;
  })
});
