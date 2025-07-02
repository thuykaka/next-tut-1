import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { meetingInsertSchema } from '@/modules/meetings/schema';
import type { MeetingGetOne } from '@/modules/meetings/types';
import { Button } from '@/components/ui/button';
import { FormDescription } from '@/components/ui/form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from '@/components/ui/kibo-ui/combobox';
import { GeneratedAvatar } from '@/components/generated-avatar';

type MeetingFormProps = {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
};

export default function MeetingForm({
  onSuccess,
  onCancel,
  initialValues
}: MeetingFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [agentSearch, setAgentSearch] = useState('');

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch
    })
  );

  // Create new meeting
  const { mutate: createMeeting, isPending: isCreating } = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions()
        );
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message, {
          description: 'Please try again.'
        });
      }
    })
  );

  // Update meeting
  const { mutate: updateMeeting, isPending: isUpdating } = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions()
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message, {
          description: 'Please try again.'
        });
      }
    })
  );

  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? ''
    }
  });

  const isEdit = !!initialValues?.id;
  const isLoading = isCreating || isUpdating;

  const onSubmit = (values: z.infer<typeof meetingInsertSchema>) => {
    if (isEdit) {
      updateMeeting({ ...values, id: initialValues.id });
    } else {
      createMeeting(values);
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder='e.g. Math Consultation' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='agentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  data={(agents.data?.data ?? []).map((agent) => ({
                    value: agent.id,
                    label: agent.name
                  }))}
                  onValueChange={field.onChange}
                  type='agent'
                >
                  <ComboboxTrigger className='w-full' />
                  <ComboboxContent shouldFilter={false}>
                    <ComboboxInput onValueChange={setAgentSearch} />
                    <ComboboxEmpty />
                    <ComboboxList>
                      <ComboboxGroup>
                        {(agents.data?.data ?? []).map((agent) => (
                          <ComboboxItem key={agent.id} value={agent.id}>
                            <div className='item-center flex gap-x-2'>
                              <GeneratedAvatar
                                seed={agent.name}
                                variant='botttsNeutral'
                                className='size-6 border'
                              />
                              <span>{agent.name}</span>
                            </div>
                          </ComboboxItem>
                        ))}
                      </ComboboxGroup>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FormControl>
              <FormDescription>
                Not found what you're looking for?{' '}
                <Link href='/agents' className='text-primary'>
                  Create a new agent
                </Link>
              </FormDescription>
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
