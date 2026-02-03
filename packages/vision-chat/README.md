# @onespace/vision-chat

Reusable chat component built on [assistant-ui](https://www.assistant-ui.com) for OneSpace vision sessions. Designed to live in a **separate repo** and be consumed by the main app.

## Use from os-web (same repo)

```bash
# From repo root
npm install ./packages/vision-chat
```

Then in your app:

```tsx
import {
  VisionChatRuntimeProvider,
  ThreadChat,
  createConvertToThreadLike,
  getTextFromAppendMessage,
} from '@onespace/vision-chat';
import type { SessionMessage } from '@/features/vision/types/session';

const convertMessage = createConvertToThreadLike<SessionMessage>();

<VisionChatRuntimeProvider
  messages={wsMessages}
  convertMessage={(msg, i) => convertMessage(msg, i)}
  onSend={sendUserMessage}
  isRunning={isTyping}
  isDisabled={!isConnected || isSessionComplete}
>
  <ThreadChat
    isSessionComplete={isSessionComplete}
    sessionCompleteNode={<YourViewNarrativeButton />}
    footerNode={<span>Chat powered by assistant-ui</span>}
  />
</VisionChatRuntimeProvider>
```

## Move to a separate repo

1. Copy this folder (`packages/vision-chat`) to a new repository.
2. Add a root `package.json`, `tsconfig.json`, and tooling (e.g. tsup) if you want to build in the new repo.
3. Publish to npm (private or public) or install from Git:
   - `npm install git+https://github.com/your-org/vision-chat.git`
4. In os-web, remove the local dependency and add the package from the new source.

## API

- **`VisionChatRuntimeProvider`** – Wraps the chat with assistant-ui runtime. Pass `messages`, `convertMessage`, `onSend`, `isRunning`, `isDisabled`.
- **`ThreadChat`** – Renders the thread (messages + input). Props: `isSessionComplete`, `inputPlaceholder`, `sessionCompleteNode`, `footerNode`, and optional `className` overrides.
- **`createConvertToThreadLike<T>()`** – Returns a converter from your message type `T` to assistant-ui’s thread message shape. Your type must extend `ChatMessage` (id, role, content, timestamp).
- **`getTextFromAppendMessage`** – Extracts plain text from assistant-ui’s append message (used internally by the runtime).

## Peer dependencies

- `react`, `react-dom` ^18
- `@assistant-ui/react` ^0.12

Styling uses Tailwind-style class names; the consuming app should have Tailwind (or compatible CSS) so classes like `rounded-2xl`, `bg-muted/50`, etc. apply.
