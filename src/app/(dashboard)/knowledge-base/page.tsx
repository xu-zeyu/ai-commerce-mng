import type { Metadata } from 'next'
import { KnowledgePageView } from '@/features/knowledge/components/knowledge-page-view'

export const metadata: Metadata = { title: '知识库' }

export default function KnowledgeBasePage() {
  return <KnowledgePageView />
}
