import type { Metadata } from 'next'
import { AiChatPageView } from '@/features/ai/chat/components/ai-chat-page-view'
import { getAiChatModelId } from '@/features/ai/chat/config/get-ai-chat-model-id'

export const metadata: Metadata = {
  title: 'AI 运营助手',
}

export default function AiChatPage() {
  return <AiChatPageView modelId={getAiChatModelId()} />
}
