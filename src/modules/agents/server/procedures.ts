import { z } from 'zod';
import {
  eq,
  sql,
  getTableColumns,
  ilike,
  and,
  desc,
  count,
  or
} from 'drizzle-orm';
import {
  MAX_PAGE_SIZE,
  DEFAULT_PAGE_SIZE,
  MIN_PAGE_SIZE,
  DEFAULT_PAGE
} from '@/config/constants';
import { db } from '@/db';
import { agents } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { agentInsertSchema, agentSelectSchema } from '@/modules/agents/schema';

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(agentSelectSchema)
    .query(async ({ input }) => {
      const [data] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`
        })
        .from(agents)
        .where(eq(agents.id, input.id));
      return data;
    }),
  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z.number().default(DEFAULT_PAGE),
          pageSize: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
          search: z.string().nullish()
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where = and(
        eq(agents.userId, ctx.auth.user.id),
        input?.search
          ? or(
              ilike(agents.name, `%${input.search}%`),
              ilike(agents.instructions, `%${input.search}%`)
            )
          : undefined
      );

      const orderBy = [desc(agents.createdAt), desc(agents.id)];

      const pagination = {
        limit: input?.pageSize ?? DEFAULT_PAGE_SIZE,
        offset:
          ((input?.page ?? DEFAULT_PAGE) - 1) *
          (input?.pageSize ?? DEFAULT_PAGE_SIZE)
      };

      const data = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`
        })
        .from(agents)
        .where(where)
        .orderBy(...orderBy)
        .limit(pagination.limit)
        .offset(pagination.offset);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(where);

      const totalPages = Math.ceil(total.count / pagination.limit);

      return {
        data,
        total: total.count,
        totalPages
      };
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
