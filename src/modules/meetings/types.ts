import { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers/_app';

export type MeetingGetOne = inferRouterOutputs<AppRouter>['meetings']['getOne'];

export type MeetingGetMany =
  inferRouterOutputs<AppRouter>['meetings']['getMany'];

export enum MeetingStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing'
}

export type StreamTranscriptItem = {
  from?: 'user' | 'assistant';
  speaker_id: string;
  type: string;
  text: string;
  start_ts: number;
  stop_ts: number;
};
