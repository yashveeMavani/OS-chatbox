import { useCallback, useMemo, type ReactNode } from 'react';
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type ExternalStoreAdapter,
  type ThreadMessageLike,
} from '@assistant-ui/react';
import type { ChatMessage } from './types';
import { getTextFromAppendMessage } from './adapter';

export interface AssistantRuntimeProviderProps<T extends ChatMessage = ChatMessage> {
  children: ReactNode;
  messages: T[];
  convertMessage: (msg: T, index: number) => ThreadMessageLike;
  onSend: (text: string) => void;
  isRunning?: boolean;
  isDisabled?: boolean;
}

export function VisionChatRuntimeProvider<T extends ChatMessage>({
  children,
  messages,
  convertMessage,
  onSend,
  isRunning = false,
  isDisabled = false,
}: AssistantRuntimeProviderProps<T>) {
  const onNew = useCallback(
    async (message: Parameters<ExternalStoreAdapter<T>['onNew']>[0]) => {
      const text = getTextFromAppendMessage(message);
      if (!text) return;
      onSend(text);
    },
    [onSend]
  );

  const store = useMemo(
    (): ExternalStoreAdapter<T> =>
      ({
        messages,
        convertMessage,
        onNew,
        isRunning,
        isDisabled,
      }) as ExternalStoreAdapter<T>,
    [messages, convertMessage, onNew, isRunning, isDisabled]
  );

  const runtime = useExternalStoreRuntime(store);

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}
