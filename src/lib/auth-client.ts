import 'client-only';
import { polarClient } from '@polar-sh/better-auth';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [polarClient()]
});

export const { signIn, signUp, useSession } = authClient;
