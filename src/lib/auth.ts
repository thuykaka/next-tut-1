import { db } from '@/db';
import * as schema from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8
  },
  rateLimit: {
    enabled: true
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema
    }
  })
});
