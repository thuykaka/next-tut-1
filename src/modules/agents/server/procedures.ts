import { db } from '@/db';
import { agents } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { eq } from 'drizzle-orm';
import { agentInsertSchema, agentSelectSchema } from '@/modules/agents/schema';

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(agentSelectSchema)
    .query(async ({ input }) => {
      const [data] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));
      return data;
    }),
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),
  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id
        })
        .returning({ id: agents.id });
      return createdAgent;
    })
});
