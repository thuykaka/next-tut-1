'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function HomeView() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: 'thuykaka' }));

  return <div>{data?.greeting}</div>;
}
