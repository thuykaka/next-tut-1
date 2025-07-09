import { format } from 'date-fns';
import {
  BookOpenIcon,
  FileVideoIcon,
  FileTextIcon,
  SparklesIcon,
  ClockFadingIcon
} from 'lucide-react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { formatDuration } from '@/lib/format';
import { MeetingGetOne } from '@/modules/meetings/types';
import { ChatProvider } from '@/modules/meetings/ui/components/chat-provider';
import Transcript from '@/modules/meetings/ui/components/transcript';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneratedAvatar } from '@/components/generated-avatar';

type CompletedStateProps = {
  data: MeetingGetOne;
};

export default function CompletedState({ data }: CompletedStateProps) {
  return (
    <div className='flex flex-col gap-y-4'>
      <Tabs defaultValue='summary'>
        <div className='bg-white px-3'>
          <ScrollArea>
            <TabsList className='bg-background h-13 justify-start rounded-none p-0'>
              <TabsTrigger
                value='summary'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <BookOpenIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value='transcript'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value='recording'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value='chat'
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                <SparklesIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>

            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
        <TabsContent value='summary'>
          <div className='bg-white p-3'>
            <div className='col-span-5 mb-6 flex flex-col gap-y-5 rounded-lg py-3'>
              <h2 className='text-2xl font-medium capitalize'>{data.name}</h2>
              <div className='flex items-center gap-x-2'>
                <Link
                  href={`/agents/${data.agent.id}`}
                  className='flex items-center gap-x-2 capitalize underline underline-offset-4'
                >
                  <GeneratedAvatar
                    seed={data.agent.name}
                    className='size-5 rounded-full'
                    variant='botttsNeutral'
                  />
                  {data.agent.name}
                </Link>{' '}
                <p>{data.startedAt ? format(data.startedAt, 'PPP') : ''}</p>
              </div>
              <div className='flex items-center gap-x-2'>
                <SparklesIcon className='size-4' />
                <p>General Summary</p>
              </div>
              <Badge
                variant='outline'
                className='flex items-center gap-x-2 [&>svg]:size-4'
              >
                <ClockFadingIcon className='text-blue-700' />
                {data.duration ? formatDuration(data.duration) : 'No duration'}
              </Badge>
            </div>
            <Markdown
              components={{
                h1: (props) => (
                  <h1 className='mb-4 text-2xl font-medium' {...props} />
                ),
                h2: (props) => (
                  <h2 className='mb-4 text-xl font-medium' {...props} />
                ),
                h3: (props) => (
                  <h3 className='mb-4 text-lg font-medium' {...props} />
                ),
                h4: (props) => (
                  <h4 className='mb-4 text-base font-medium' {...props} />
                ),
                h5: (props) => (
                  <h5 className='mb-4 text-sm font-medium' {...props} />
                ),
                h6: (props) => (
                  <h6 className='mb-4 text-xs font-medium' {...props} />
                ),
                p: (props) => (
                  <p className='mb-4 text-sm leading-relaxed' {...props} />
                ),
                ul: (props) => (
                  <ul className='mb-4 list-inside list-disc' {...props} />
                ),
                ol: (props) => (
                  <ol className='mb-4 list-inside list-decimal' {...props} />
                ),
                li: (props) => <li className='mb-1' {...props} />,
                strong: (props) => (
                  <strong className='font-semibold' {...props} />
                ),
                code: (props) => (
                  <code className='rounded bg-gray-100 p-1' {...props} />
                ),
                blockquote: (props) => (
                  <blockquote
                    className='rounded border-l-2 border-gray-100 pl-4 italic'
                    {...props}
                  />
                )
              }}
            >
              {data.summary}
            </Markdown>
          </div>
        </TabsContent>
        <TabsContent value='transcript'>
          <Transcript meetingId={data.id} />
        </TabsContent>
        <TabsContent value='recording'>
          <div className='bg-white p-3'>
            <video
              src={data.recordingUrl!}
              controls
              className='w-full rounded-lg'
            />
          </div>
        </TabsContent>
        <TabsContent value='chat'>
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
