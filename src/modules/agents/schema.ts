import { z } from 'zod';

export const agentInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  instructions: z.string().min(1, 'Instructions are required')
});

export const agentSelectSchema = z.object({
  id: z.string()
});
