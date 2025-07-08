'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { authClient } from '@/lib/auth-client';
import PricingCard from '@/modules/premium/ui/components/pricing-card';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';

export function UpgradeView() {
  const trpc = useTRPC();

  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions()
  );

  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );

  console.log(products);

  return (
    <div className='flex flex-1 flex-col gap-y-10 px-4 py-4 md:px-8'>
      <div className='mt-4 flex flex-1 flex-col items-center gap-y-10'>
        <h5 className='text-2xl font-medium md:text-3xl'>
          You are on the{' '}
          <span className='text-primary font-semibold'>
            {currentSubscription?.name ?? 'Free'}
          </span>{' '}
          plan
        </h5>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products?.map((product) => {
            const isCurrentProduct = currentSubscription?.id === product.id;
            const isPremium = !!currentSubscription;
            const buttonText = isCurrentProduct
              ? 'Manage Subscription'
              : isPremium
                ? 'Change Plan'
                : 'Upgrade';

            const onClick = () =>
              isCurrentProduct || isPremium
                ? authClient.customer.portal()
                : authClient.checkout({
                    products: [product.id]
                  });

            return (
              <PricingCard
                key={product.id}
                variant={
                  product.metadata.variant === 'highlighted'
                    ? 'selected'
                    : 'default'
                }
                title={product.name}
                price={
                  product.prices[0].amountType === 'fixed'
                    ? product.prices[0].priceAmount / 100
                    : 0
                }
                priceSuffix={`/${product.prices[0].recurringInterval}`}
                description={product.description}
                features={product.benefits.map(
                  (benefit) => benefit.description
                )}
                badge={product.metadata.badge as string | null}
                buttonText={buttonText}
                onClick={onClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function UpgradeViewLoading() {
  return <LoadingState title='Loading Upgrade' />;
}

export function UpgradeViewError() {
  return <ErrorState title='Failed to load upgrade' />;
}
