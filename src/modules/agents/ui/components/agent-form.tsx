import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { agentInsertSchema } from '@/modules/agents/schema';
import type { AgentGetOne } from '@/modules/agents/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { useRouter } from 'next/navigation';

type AgentFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
};

export default function AgentForm({
  onSuccess,
  onCancel,
  initialValues
}: AgentFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Create new agent
  const { mutate: createAgent, isPending: isCreating } = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions()
        );
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === 'FORBIDDEN') {
          router.push('/upgrade');
        }
      }
    })
  );

  // Update agent
  const { mutate: updateAgent, isPending: isUpdating } = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  );

  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instructions: initialValues?.instructions ?? ''
    }
  });

  const isEdit = !!initialValues?.id;
  const isLoading = isCreating || isUpdating;

  const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
    if (isEdit) {
      updateAgent({ ...values, id: initialValues.id });
    } else {
      createAgent(values);
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex items-center gap-4'>
          <GeneratedAvatar
            seed={form.watch('name')}
            variant='botttsNeutral'
            className='size-16 rounded-full'
          />
        </div>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g. Math Tutor' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='instructions'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='You are a helpful assistant that can answer questions and help with tasks.'
                  className='h-30'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-x-2'>
          {onCancel && (
            <Button
              type='button'
              variant='ghost'
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2Icon className='animate-spin' />}
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
