'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Card } from '@/components/ui/card'
import type { GoodsCategoryTreeNode } from '../types'

interface LevelStat {
  name: string
  count: number
}

function collectLevelStats(nodes: GoodsCategoryTreeNode[], map = new Map<number, number>()) {
  nodes.forEach((node) => {
    map.set(node.level, (map.get(node.level) ?? 0) + 1)
    collectLevelStats(node.children ?? [], map)
  })
  return map
}

function toChartData(nodes: GoodsCategoryTreeNode[]): LevelStat[] {
  return Array.from(collectLevelStats(nodes).entries())
    .sort(([a], [b]) => a - b)
    .map(([level, count]) => ({ name: `${level}级`, count }))
}

export function CategoryInsightChart({ tree }: { tree: GoodsCategoryTreeNode[] }) {
  const data = toChartData(tree)

  return (
    <Card className="border-border/60 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">层级分布</h2>
          <p className="mt-1 text-sm text-muted-foreground">快速判断分类结构是否过深</p>
        </div>
      </div>
      <div className="h-44">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                  borderRadius: 14,
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 8px 24px rgb(0 0 0 / 0.08)',
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl bg-muted/50 text-sm text-muted-foreground">
            暂无分类数据
          </div>
        )}
      </div>
    </Card>
  )
}
