import { useCallback, useRef, useState } from 'react';
import {
  ThreadPrimitive,
  useThreadRuntime,
  useThread,
  useAuiState,
} from '@assistant-ui/react';

export interface ThreadChatProps {
  /** When true, show sessionCompleteNode instead of input */
  isSessionComplete?: boolean;
  /** Placeholder for the message input */
  inputPlaceholder?: string;
  /** Shown when isSessionComplete is true instead of input (e.g. "View narrative" CTA) */
  sessionCompleteNode?: React.ReactNode;
  /** Optional footer above input (e.g. "Chat powered by assistant-ui") */
  footerNode?: React.ReactNode;
  /** Optional class for the root container */
  className?: string;
  /** Optional class for the viewport */
  viewportClassName?: string;
  /** Optional class for the input wrapper */
  inputWrapperClassName?: string;
  /** Optional class for the send button */
  sendButtonClassName?: string;
  /** Optional class for empty state (loading) */
  emptyClassName?: string;
}

function getMessageText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return (content as { type?: string; text?: string }[])
    .filter((p) => p.type === 'text')
    .map((p) => p.text ?? '')
    .join('');
}

function cleanAssistantText(text: string): string {
  return text.replace(/^[❓?]\s*/, '').replace(/💡\s*/g, '');
}

function ChatMessageBubble() {
  const role = useAuiState(({ message }) => message.role);
  const content = useAuiState(({ message }) => message.content);
  const rawText = getMessageText(content);
  const text = role === 'assistant' ? cleanAssistantText(rawText) : rawText;

  const isUser = role === 'user';

  return (
    <div className={`message-bubble chatgpt-message ${isUser ? 'chatgpt-message-user' : 'chatgpt-message-assistant'}`}>
      {!isUser && (
        <div className="chatgpt-msg-avatar">
          <div className="chatgpt-msg-avatar-inner">C</div>
        </div>
      )}
      <div className="chatgpt-message-body">
        <div className={isUser ? 'chatgpt-bubble chatgpt-bubble-user' : 'chatgpt-bubble chatgpt-bubble-assistant'}>
          <div className="chatgpt-bubble-text">{text}</div>
        </div>
      </div>
      {isUser && <div className="chatgpt-message-spacer" />}
    </div>
  );
}

export function ThreadChat({
  isSessionComplete = false,
  inputPlaceholder = 'Message ChatGPT',
  sessionCompleteNode,
  footerNode,
  className,
  viewportClassName,
  inputWrapperClassName,
  sendButtonClassName,
  emptyClassName,
}: ThreadChatProps) {
  const threadRuntime = useThreadRuntime();
  const thread = useThread();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text || thread.isDisabled || !threadRuntime) return;
    threadRuntime.append(text);
    setInput('');
  }, [input, thread.isDisabled, threadRuntime]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const showComplete = isSessionComplete && sessionCompleteNode != null;
  const showInput = !showComplete;

  return (
    <ThreadPrimitive.Root className={className ?? 'chatgpt-thread'}>
      <ThreadPrimitive.Viewport
        className={viewportClassName ?? 'chatgpt-viewport'}
      >
        <div className="chatgpt-viewport-inner">
          <ThreadPrimitive.Messages components={{ Message: ChatMessageBubble }} />
          <ThreadPrimitive.Empty>
            <div className="chatgpt-empty-state">
              <div className={emptyClassName ?? 'chatgpt-empty-avatar'}>
                C
              </div>
              <p className="chatgpt-empty-text">How can I help you today?</p>
            </div>
          </ThreadPrimitive.Empty>
        </div>
      </ThreadPrimitive.Viewport>

      <ThreadPrimitive.ViewportFooter className="chatgpt-footer">
        <div className="chatgpt-footer-inner">
          {showComplete && sessionCompleteNode}
          {showInput && (
            <div
              className={
                inputWrapperClassName ?? 'chatgpt-composer'
              }
            >
              <div className="flex flex-1 items-center gap-2 py-2 pr-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={inputPlaceholder}
                  disabled={thread.isDisabled}
                  rows={1}
                  className="chatgpt-input"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!input.trim() || thread.isDisabled}
                  className={sendButtonClassName ?? 'chatgpt-send'}
                  aria-label="Send message"
                  title="Send message (Enter)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {footerNode && (
            <p className="chatgpt-footer-text">
              {footerNode}
            </p>
          )}
        </div>
      </ThreadPrimitive.ViewportFooter>

      <ThreadPrimitive.ScrollToBottom />
    </ThreadPrimitive.Root>
  );
}
