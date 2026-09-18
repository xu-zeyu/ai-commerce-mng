'use client'

import { ThreadPrimitive } from '@assistant-ui/react'
import { Bot, FileQuestion, Lightbulb, MessageCircleQuestion, Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  {
    icon: MessageCircleQuestion,
    title: '回答产品咨询',
    description: '介绍我们的核心产品和适用场景',
    prompt: '请介绍一下我们的核心产品、主要优势和适用场景。',
  },
  {
    icon: FileQuestion,
    title: '查询售后政策',
    description: '说明退换货条件和处理流程',
    prompt: '请说明退换货政策、申请条件和具体处理流程。',
  },
  {
    icon: Lightbulb,
    title: '生成专业回复',
    description: '帮助处理客户的价格异议',
    prompt: '客户认为价格偏高，请生成一段专业、友好的客服回复。',
  },
  {
    icon: Sparkles,
    title: '总结客户需求',
    description: '提炼信息并给出下一步建议',
    prompt: '请告诉我如何快速梳理客户需求，并给出下一步跟进建议。',
  },
] as const

export function ChatWelcome() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
        <Bot className="size-6" />
      </div>
      <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
        今天需要我帮你处理什么？
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-muted-foreground">
        基于企业知识库回答客户问题，协助你快速生成准确、友好的服务回复。
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map(({ description, icon: Icon, prompt, title }) => (
          <ThreadPrimitive.Suggestion
            key={title}
            prompt={prompt}
            send
            className="group rounded-2xl border bg-card/70 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
              </div>
            </div>
          </ThreadPrimitive.Suggestion>
        ))}
      </div>
    </div>
  )
}
