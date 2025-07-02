import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';
import { DEFAULT_PAGE } from '@/config/constants';

export const useAgentsFilter = () => {
  return useQueryStates({
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
      clearOnDefault: true
    }),
    search: parseAsString.withDefault('').withOptions({
      clearOnDefault: true
    })
  });
};
