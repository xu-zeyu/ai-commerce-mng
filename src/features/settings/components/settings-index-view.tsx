'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useFilteredNav } from '@/hooks/use-filtered-nav'

export function SettingsIndexView() {
  const router = useRouter()
  const settings = useFilteredNav()
    .flatMap((section) => section.items)
    .find((item) => item.href === '/settings')
  const firstChild = settings?.children?.[0]

  useEffect(() => {
    if (firstChild) router.replace(firstChild.href)
  }, [firstChild, router])

  if (firstChild) return null

  return (
    <Card className="flex flex-col items-center justify-center rounded-2xl py-20 shadow-sm">
      <ShieldAlert className="size-12 text-muted-foreground/30" />
      <p className="mt-4 text-sm text-muted-foreground">暂无可访问的设置页面</p>
    </Card>
  )
}
