import type { Metadata } from 'next'
import { StreamPageView } from '@/features/stream/components/stream-page-view'

export const metadata: Metadata = { title: '实时输出' }

export default function StreamPage() {
  return <StreamPageView />
}
