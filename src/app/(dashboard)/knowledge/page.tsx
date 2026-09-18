import type { Metadata } from 'next'
import { KnowledgePageView } from '@/features/knowledge/components/knowledge-page-view'

export const metadata: Metadata = { title: '知识文档' }

export default function KnowledgePage() {
  return <KnowledgePageView />
}
