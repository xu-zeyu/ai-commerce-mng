import type { Metadata } from 'next'
import { AiCreationPageView } from '@/features/ai-creation/components/ai-creation-page-view'

export const metadata: Metadata = { title: 'AI 创作' }

export default function AiCreationPage() {
  return <AiCreationPageView />
}
