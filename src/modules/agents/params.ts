import { parseAsString, parseAsInteger, createLoader } from 'nuqs/server';
import { DEFAULT_PAGE } from '@/config/constants';

export const filterAgentsSearchParams = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
    clearOnDefault: true
  }),
  search: parseAsString.withDefault('').withOptions({
    clearOnDefault: true
  })
};

export const loadAgentsSearchParams = createLoader(filterAgentsSearchParams);
