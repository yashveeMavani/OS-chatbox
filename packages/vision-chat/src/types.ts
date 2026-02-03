/**
 * Minimal message shape required by the chat package.
 * Your app can map its own message type (e.g. SessionMessage) to this.
 */
export interface ChatMessage {
  id?: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: Date;
}
