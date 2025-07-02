import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq, getTableColumns, ilike, and, desc, count, or, sql } from 'drizzle-orm';
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE, MIN_PAGE_SIZE, DEFAULT_PAGE } from '@/config/constants';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { meetingInsertSchema, meetingSelectSchema, meetingUpdateSchema } from '@/modules/meetings/schema';


export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(meetingSelectSchema)
    .query(async ({ ctx, input }) => {
      const whereClause = and(
        eq(meetings.id, input.id),
        eq(meetings.userId, ctx.auth.user.id)
      );

      const [data] = await db
        .select({
          ...getTableColumns(meetings)
        })
        .from(meetings)
        .where(whereClause);

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found'
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
        eq(meetings.userId, ctx.auth.user.id),
        input?.search
          ? or(ilike(meetings.name, `%${input.search}%`))
          : undefined
      );

      const orderByClause = [desc(meetings.createdAt), desc(meetings.id)];

      const pagination = {
        limit: input?.pageSize ?? DEFAULT_PAGE_SIZE,
        offset:
          ((input?.page ?? DEFAULT_PAGE) - 1) *
          (input?.pageSize ?? DEFAULT_PAGE_SIZE)
      };

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as('duration')
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(whereClause)
        .orderBy(...orderByClause)
        .limit(pagination.limit)
        .offset(pagination.offset);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(whereClause);

      const totalPages = Math.ceil(total.count / pagination.limit);

      return {
        data,
        total: total.count,
        totalPages
      };
    }),
  create: protectedProcedure
    .input(meetingInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id
        })
        .returning({ id: meetings.id });
      return createdMeeting;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const whereClause = and(
        eq(meetings.id, input.id),
        eq(meetings.userId, ctx.auth.user.id)
      );

      const [data] = await db.delete(meetings).where(whereClause).returning();

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found'
        });
      }

      return data;
    }),
  update: protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const whereClause = and(
        eq(meetings.id, input.id),
        eq(meetings.userId, ctx.auth.user.id)
      );

      const [data] = await db
        .update(meetings)
        .set(input)
        .where(whereClause)
        .returning();

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found'
        });
      }

      return data;
    })
});