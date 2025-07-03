import {
  parseAsString,
  parseAsInteger,
  createLoader,
  parseAsStringEnum
} from 'nuqs/server';
import { DEFAULT_PAGE } from '@/config/constants';
import { MeetingStatus } from '@/modules/meetings/types';

export const filterMeetingsSearchParams = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
    clearOnDefault: true
  }),
  search: parseAsString.withDefault('').withOptions({
    clearOnDefault: true
  }),
  status: parseAsStringEnum(Object.values(MeetingStatus)),
  agentId: parseAsString.withDefault('').withOptions({
    clearOnDefault: true
  })
};

export const loadMeetingsSearchParams = createLoader(
  filterMeetingsSearchParams
);
