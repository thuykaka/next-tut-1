import { db } from '@/db';
import { agents } from '@/db/schema';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await db.select().from(agents);
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    return data;
  })
});
