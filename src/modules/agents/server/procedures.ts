import { z } from 'zod';
import { TRPCError } from '@trpc/server';
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
import {
  agentInsertSchema,
  agentSelectSchema,
  agentUpdateSchema
} from '@/modules/agents/schema';

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(agentSelectSchema)
    .query(async ({ ctx, input }) => {
      const whereClause = and(
        eq(agents.id, input.id),
        eq(agents.userId, ctx.auth.user.id)
      );

      const [data] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`
        })
        .from(agents)
        .where(whereClause);

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found'
        });
      }

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
      const whereClause = and(
        eq(agents.userId, ctx.auth.user.id),
        input?.search
          ? or(
              ilike(agents.name, `%${input.search}%`),
              ilike(agents.instructions, `%${input.search}%`)
            )
          : undefined
      );

      const orderByClause = [desc(agents.createdAt), desc(agents.id)];

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
        .where(whereClause)
        .orderBy(...orderByClause)
        .limit(pagination.limit)
        .offset(pagination.offset);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(whereClause);

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
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const whereClause = and(
        eq(agents.id, input.id),
        eq(agents.userId, ctx.auth.user.id)
      );

      const [data] = await db.delete(agents).where(whereClause).returning();

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found'
        });
      }

      return data;
    }),
  update: protectedProcedure
    .input(agentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const whereClause = and(
        eq(agents.id, input.id),
        eq(agents.userId, ctx.auth.user.id)
      );

      const [data] = await db
        .update(agents)
        .set(input)
        .where(whereClause)
        .returning();

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found'
        });
      }

      return data;
    })
});
