import { z } from 'zod';

export const meetingSelectSchema = z.object({
  id: z.string()
});

export const meetingInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  agentId: z.string().min(1, 'Agent is required')
});

export const meetingUpdateSchema = meetingInsertSchema.extend({
  id: z.string().min(1, 'ID is required')
});