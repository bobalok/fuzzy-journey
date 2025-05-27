# ModelSelector Integration

## Overview

This document outlines the integration of the `ModelSelector` component into the `MultimodalInput` component in Tiger.Chat. This enhancement allows users to select different AI models directly from the chat input area, improving the user experience by making model selection more accessible.

## Implementation Summary

### Components Modified

1. **MultimodalInput Component** (`/components/multimodal-input.tsx`)
   - Added new props for session and model selection
   - Added UI integration of ModelSelector

2. **Artifact Component** (`/components/artifact.tsx`)
   - Updated to support the same model selection capabilities
   - Added necessary props and imports

3. **Chat Component** (`/components/chat.tsx`)
   - Updated to pass required props to child components

## Detailed Changes

### 1. MultimodalInput Component Updates

#### New Props Added
```tsx
function PureMultimodalInput({
  // ...existing props...
  session,
  selectedModelId,
}: {
  // ...existing prop types...
  session: Session;
  selectedModelId: string;
}) {
  // Component implementation
}
```

#### UI Integration
```tsx
<div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start gap-2 items-center">
  <AttachmentsButton fileInputRef={fileInputRef} status={status} />
  <ModelSelector
    session={session}
    selectedModelId={selectedModelId}
    className="h-[34px]"
  />
</div>
```

#### Memo Optimization
```tsx
export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;
    if (prevProps.selectedModelId !== nextProps.selectedModelId) return false;

    return true;
  },
);
```

### 2. Artifact Component Updates

#### Props Extension
```tsx
function PureArtifact({
  // ...existing props...
  session,
  selectedModelId,
}: {
  // ...existing prop types...
  session: Session;
  selectedModelId: string;
}) {
  // Component implementation
}
```

#### Required Imports
```tsx
import type { Session } from 'next-auth';
```

#### Memo Optimization
```tsx
export const Artifact = memo(PureArtifact, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (!equal(prevProps.messages, nextProps.messages.length)) return false;
  if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
    return false;
  if (prevProps.selectedModelId !== nextProps.selectedModelId) return false;

  return true;
});
```

### 3. Chat Component Updates

#### Updated MultimodalInput Usage
```tsx
<MultimodalInput
  chatId={id}
  input={input}
  setInput={setInput}
  handleSubmit={handleSubmit}
  status={status}
  stop={stop}
  attachments={attachments}
  setAttachments={setAttachments}
  messages={messages}
  setMessages={setMessages}
  append={append}
  selectedVisibilityType={visibilityType}
  session={session}
  selectedModelId={initialChatModel}
/>
```

#### Updated Artifact Usage
```tsx
<Artifact
  chatId={id}
  input={input}
  setInput={setInput}
  handleSubmit={handleSubmit}
  status={status}
  stop={stop}
  attachments={attachments}
  setAttachments={setAttachments}
  append={append}
  messages={messages}
  setMessages={setMessages}
  reload={reload}
  votes={votes}
  isReadonly={isReadonly}
  selectedVisibilityType={visibilityType}
  session={session}
  selectedModelId={initialChatModel}
/>
```

## User Experience

With this integration, users can now:

1. Select different AI models directly from the chat input interface
2. See the currently selected model
3. Change models without navigating away from the chat

The ModelSelector component is positioned next to the AttachmentsButton in the MultimodalInput, making it easily accessible while maintaining a clean UI.

## Technical Considerations

1. **Type Safety**: All component props are properly typed with TypeScript
2. **Performance**: Memo comparison functions are updated to prevent unnecessary re-renders
3. **Consistency**: The implementation follows existing patterns in the codebase
4. **Accessibility**: The component maintains proper accessibility standards

## Future Enhancements

Potential future improvements could include:

1. Adding model-specific indicators in the chat messages
2. Implementing model-specific suggestions
3. Adding a model comparison feature
4. Persisting model selection preferences per conversation
