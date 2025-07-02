import { z } from 'zod';

export const meetingSelectSchema = z.object({
  id: z.string()
});
