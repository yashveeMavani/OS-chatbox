import { StrictMode, useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { VisionChatRuntimeProvider } from './AssistantRuntimeProvider';
import { ThreadChat } from './ThreadChat';
import { createConvertToThreadLike } from './adapter';
import type { ChatMessage } from './types';
import './styles.css';

function DevApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const onSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        role: 'user',
        content: text,
        timestamp: new Date(),
      },
      {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `You said: "${text}". This is a dev placeholder response.`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const convertMessage = useMemo(() => createConvertToThreadLike<ChatMessage>(), []);

  return (
    <VisionChatRuntimeProvider
      messages={messages}
      convertMessage={convertMessage}
      onSend={onSend}
    >
      <div className="chat-container">
        <ThreadChat
          inputPlaceholder="Message ChatGPT"
          footerNode={
            <span>ChatGPT can make mistakes. Check important info.</span>
          }
        />
      </div>
    </VisionChatRuntimeProvider>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <DevApp />
    </StrictMode>
  );
}
