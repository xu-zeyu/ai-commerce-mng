import Link from 'next/link'
import {
  Activity,
  ArrowUpRight,
  Bot,
  FileText,
  MessageCircleMore,
  Radio,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const CAPABILITIES = [
  {
    title: '实时输出',
    description: '直接展示 AI Agent 从 /api/see 推送的流式内容。',
    href: '/stream',
    icon: Activity,
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    title: '知识文档',
    description: '上传 Markdown 运营文档，为公众号 Agent 提供业务上下文。',
    href: '/knowledge',
    icon: FileText,
    accent: 'bg-primary/10 text-primary',
  },
] as const

export function DashboardView() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <MessageCircleMore className="size-6" />
          </div>
          <p className="text-sm font-medium text-primary">WECHAT AI AUTOMATION</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            公众号自动化工作台
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            连接 Python AI Agent，统一查看运行输出、管理运营知识，为内容生产与公众号自动化提供清晰入口。
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatusCard icon={Radio} label="数据通道" value="SSE 实时流" hint="/api/see" />
        <StatusCard icon={Bot} label="业务服务" value="Agent API" hint="/api/v1" />
        <StatusCard icon={ShieldCheck} label="访问控制" value="已启用登录保护" hint="Java Auth" />
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-base font-semibold">平台能力</h2>
          <p className="mt-1 text-sm text-muted-foreground">从实时信息到知识输入，保持 Agent 运行可见、内容可管。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {CAPABILITIES.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full rounded-2xl transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.accent}`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{item.title}</h3>
                        <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

interface StatusCardProps {
  icon: typeof Radio
  label: string
  value: string
  hint: string
}

function StatusCard({ icon: Icon, label, value, hint }: StatusCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Icon className="size-4 text-primary" />
          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">已配置</span>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}
