import {
  parseAsString,
  parseAsInteger,
  useQueryStates,
  parseAsStringEnum
} from 'nuqs';
import { DEFAULT_PAGE } from '@/config/constants';
import { MeetingStatus } from '@/modules/meetings/types';

export const useMeetingsFilter = () => {
  return useQueryStates({
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
  });
};
