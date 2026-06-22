import { FolderTree, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Props {
  total: number
  enabled: number
  rootCount: number
  maxLevel: number
}

const items = [
  { key: 'total', label: '全部分类', icon: FolderTree },
  { key: 'enabled', label: '启用中', icon: ShieldCheck },
  { key: 'rootCount', label: '一级分类', icon: Sparkles },
  { key: 'maxLevel', label: '最深层级', icon: Layers3 },
] as const

export function CategorySummaryCards({ total, enabled, rootCount, maxLevel }: Props) {
  const values = { total, enabled, rootCount, maxLevel }

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.key} className="border-border/60 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{values[item.key]}</p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
            </div>
          </Card>
        )
      })}
    </section>
  )
}
