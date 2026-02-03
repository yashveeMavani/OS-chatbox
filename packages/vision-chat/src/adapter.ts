import type { AppendMessage, ThreadMessageLike } from '@assistant-ui/react';
import type { ChatMessage } from './types';

/**
 * Convert your app message to the shape assistant-ui expects.
 * Implement this for your message type (e.g. SessionMessage).
 */
export function createConvertToThreadLike<T extends ChatMessage>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _messageType?: T
): (msg: T, _index: number) => ThreadMessageLike {
  return (msg: T) => ({
    role: msg.role,
    content: [{ type: 'text' as const, text: typeof msg.content === 'string' ? msg.content : '' }],
    id: msg.id,
    createdAt: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
  });
}

export function getTextFromAppendMessage(message: AppendMessage): string {
  const content = message.content as string | readonly { type: string; text?: string }[];
  if (typeof content === 'string') {
    return content.trim();
  }
  if (Array.isArray(content)) {
    for (const p of content) {
      if (p?.type === 'text' && p.text != null) {
        return String(p.text).trim();
      }
    }
  }
  return '';
}
