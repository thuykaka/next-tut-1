import { eq, count } from 'drizzle-orm';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { polarServerClient } from '@/lib/polar-server';

export const premiumRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarServerClient.customers.getStateExternal({
      externalId: ctx.auth.user.id
    });

    const subscription = customer.activeSubscriptions[0];

    if (!subscription) {
      return null;
    }

    const product = await polarServerClient.products.get({
      id: subscription.productId
    });

    return product;
  }),
  getProducts: protectedProcedure.query(async ({ ctx }) => {
    const products = await polarServerClient.products.list({
      isArchived: false,
      isRecurring: true,
      sorting: ['price_amount']
    });
    return products.result.items;
  }),
  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarServerClient.customers.getStateExternal({
      externalId: ctx.auth.user.id
    });

    const subscription = customer.activeSubscriptions[0];

    if (subscription) {
      return null;
    }

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

    return {
      meetingCount: userMeetings.meetingCount,
      agentCount: userAgents.agentCount
    };
  })
});
