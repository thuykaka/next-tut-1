import { type VariantProps, cva } from 'class-variance-authority';
import { CircleCheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const pricingCardVariants = cva('rounded-2xl p-4 py-6 w-full', {
  variants: {
    variant: {
      default: 'bg-white text-black',
      selected: 'bg-gradient-to-br from-[#093C23] to-[#051B16] text-white'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

const pricingCardIconVariants = cva('size-5', {
  variants: {
    variant: {
      default: 'fill-primary text-white',
      selected: 'fill-white text-black'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

const pricingCardSecondaryTextVariants = cva('text-neutral-700', {
  variants: {
    variant: {
      default: 'text-neutral-700',
      selected: 'text-neutral-300'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

const pricingCardSecondaryVariants = cva('text-neutral-700', {
  variants: {
    variant: {
      default: 'text-neutral-700',
      selected: 'text-neutral-300'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

const pricingCardBadgeVariants = cva('text-black text-xs font-normal p-1', {
  variants: {
    variant: {
      default: 'bg-primary/20',
      selected: 'bg-[#F5B797]'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

type PricingCardProps = {
  badge?: string | null;
  price: number;
  features: string[];
  title: string;
  description?: string | null;
  priceSuffix: string;
  className?: string;
  buttonText: string;
  onClick: () => void;
} & VariantProps<typeof pricingCardVariants>;

export default function PricingCard({
  variant,
  badge,
  price,
  features,
  title,
  description,
  priceSuffix,
  className,
  buttonText,
  onClick
}: PricingCardProps) {
  return (
    <div className={cn(pricingCardVariants({ variant }), className, 'border')}>
      <div className='flex items-end justify-between gap-x-4'>
        <div className='flex flex-col gap-y-2'>
          <div className='flex items-center gap-x-2'>
            <h6 className='text-xl font-medium'>{title}</h6>
            {badge ? (
              <Badge className={cn(pricingCardBadgeVariants({ variant }))}>
                {badge}
              </Badge>
            ) : null}
          </div>
          <p
            className={cn(pricingCardSecondaryVariants({ variant }), 'text-xs')}
          >
            {description}
          </p>
        </div>
        <div className='flex shrink-0 items-end gap-x-0.5'>
          <h4 className='text-3xl font-medium'>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(price)}
          </h4>
          <span className={cn(pricingCardSecondaryTextVariants({ variant }))}>
            {priceSuffix}
          </span>
        </div>
      </div>
      <div className='py-6'>
        <Separator className='text-[#5D6B68] opacity-10' />
      </div>
      <Button
        className='w-full'
        size='lg'
        variant={variant === 'selected' ? 'default' : 'outline'}
        onClick={onClick}
      >
        {buttonText}
      </Button>
      <div className='mt-6 flex flex-col gap-y-2'>
        <p className='font-medium uppercase'>Features</p>
        <ul
          className={cn(
            pricingCardSecondaryTextVariants({ variant }),
            'flex flex-col gap-y-2.5'
          )}
        >
          {features?.map((feature, index) => (
            <li key={index} className='flex items-center gap-x-2.5 text-sm'>
              <CircleCheckIcon
                className={cn(pricingCardIconVariants({ variant }))}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
