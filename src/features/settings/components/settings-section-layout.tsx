'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useFilteredNav } from '@/hooks/use-filtered-nav'

export function SettingsSectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const settings = useFilteredNav()
    .flatMap((section) => section.items)
    .find((item) => item.href === '/settings')

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
              <Settings className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">设置</h1>
              <p className="text-sm text-muted-foreground">权限与角色</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings?.children?.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </Card>
      {children}
    </div>
  )
}
