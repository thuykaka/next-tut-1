import 'server-only';
import { StreamChat } from 'stream-chat';

export const streamChatServerClient = new StreamChat(
  process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
  process.env.STREAM_CHAT_SECRET_KEY!
);
