import type { Metadata } from 'next'
import { CustomerServicePageView } from '@/features/customer-service/components/customer-service-page-view'

export const metadata: Metadata = { title: '企业客服' }

export default function CustomerServicePage() {
  return <CustomerServicePageView />
}
