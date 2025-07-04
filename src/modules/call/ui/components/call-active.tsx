import { SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';
import Image from 'next/image';
import Link from 'next/link';

type CallActiveProps = {
  meetingName: string;
  onLeaveCall: () => void;
};

export default function CallActive({
  meetingName,
  onLeaveCall
}: CallActiveProps) {
  return (
    <div className='flex h-full flex-col justify-between p-4 text-white'>
      <div className='flex items-center gap-4 rounded-full bg-[#101213] p-4'>
        <Link
          href='/'
          className='flex w-fit items-center justify-center rounded-full bg-white/10 p-1'
        >
          <Image src='/logo.svg' alt='logo' width={22} height={22} />
        </Link>
        <h4 className='text-base'>{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className='rounded-full bg-[#101213] px-4'>
        <CallControls onLeave={onLeaveCall} />
      </div>
    </div>
  );
}
