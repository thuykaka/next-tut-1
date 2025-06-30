import {
  defaultShouldDehydrateQuery,
  QueryClient
} from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000 // sẽ refetch nếu hết thời gian này, đặt về 0 để không cache
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      }
    }
  });
}
