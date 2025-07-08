import { cache } from 'react';
import { initTRPC, TRPCError } from '@trpc/server';
import { eq, count } from 'drizzle-orm';
import { headers } from 'next/headers';
import { MAX_FREE_MEETINGS, MAX_FREE_AGENTS } from '@/config/constants';
import { db } from '@/db';
import { meetings, agents, session } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarServerClient } from '@/lib/polar-server';

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  }

  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = (entity: 'agent' | 'meeting') =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarServerClient.customers.getStateExternal({
      externalId: ctx.auth.user.id
    });

    const [userMeetings] = await db
      .select({
        meetingCount: count(meetings.id)
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
      .select({
        agentCount: count(agents.id)
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    const isPremium = customer.activeSubscriptions.length > 0;
    const isFreeAgentExceeded = userAgents.agentCount >= MAX_FREE_AGENTS;
    const isFreeMeetingExceeded =
      userMeetings.meetingCount >= MAX_FREE_MEETINGS;

    const shouldThrowMeetingError =
      !isPremium && isFreeMeetingExceeded && entity === 'meeting';
    const shouldThrowAgentError =
      !isPremium && isFreeAgentExceeded && entity === 'agent';

    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of free meetings.'
      });
    }

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You have reached the maximum number of free agents.'
      });
    }

    return next({ ctx: { ...ctx, customer } });
  });
