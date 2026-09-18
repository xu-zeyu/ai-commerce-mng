'use client'

import {
  Children,
  isValidElement,
  memo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import ReactMarkdown, { type Components, type ExtraProps } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentMarkdownProps {
  isStreaming: boolean
  text: string
}

type CodeElementProps = { children?: ReactNode; className?: string }
type MarkdownPreProps = ComponentPropsWithoutRef<'pre'> & ExtraProps

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  return Children.toArray(node).map((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return ''
    return getTextContent(child.props.children)
  }).join('')
}

function MarkdownCodeBlock({ children }: MarkdownPreProps) {
  const [copied, setCopied] = useState(false)
  const codeElement = Children.toArray(children)[0]
  const codeProps = isValidElement<CodeElementProps>(codeElement) ? codeElement.props : undefined
  const language = codeProps?.className?.match(/language-([\w-]+)/)?.[1] || '代码'
  const code = getTextContent(codeProps?.children ?? children).replace(/\n$/, '')

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="my-5 overflow-hidden rounded-xl bg-[#202123] text-zinc-100 shadow-sm ring-1 ring-black/10 dark:bg-[#171717] dark:ring-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-zinc-400">
        <span className="font-medium lowercase">{language}</span>
        <button type="button" onClick={copyCode} className="flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-zinc-200">
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto p-4 text-[13px] leading-6 sm:p-5">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}

const components: Components = {
  h1: ({ className, ...props }) => <h1 className={cn('mb-3 mt-7 text-2xl font-semibold tracking-tight first:mt-0', className)} {...props} />,
  h2: ({ className, ...props }) => <h2 className={cn('mb-2.5 mt-6 text-xl font-semibold tracking-tight first:mt-0', className)} {...props} />,
  h3: ({ className, ...props }) => <h3 className={cn('mb-2 mt-5 text-base font-semibold first:mt-0', className)} {...props} />,
  p: ({ className, ...props }) => <p className={cn('my-3.5 break-words leading-8 first:mt-0 last:mb-0', className)} {...props} />,
  ul: ({ className, ...props }) => <ul className={cn('my-3.5 list-disc space-y-1.5 pl-6 marker:text-primary', className)} {...props} />,
  ol: ({ className, ...props }) => <ol className={cn('my-3.5 list-decimal space-y-1.5 pl-6 marker:font-medium marker:text-primary', className)} {...props} />,
  li: ({ className, ...props }) => <li className={cn('pl-1 leading-7 [&>p]:my-0', className)} {...props} />,
  blockquote: ({ className, ...props }) => <blockquote className={cn('my-4 rounded-r-xl border-l-4 border-primary/50 bg-primary/5 px-4 py-2 text-muted-foreground [&>p]:my-0', className)} {...props} />,
  a: ({ className, ...props }) => <a className={cn('font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary', className)} target="_blank" rel="noreferrer" {...props} />,
  strong: ({ className, ...props }) => <strong className={cn('font-semibold text-foreground', className)} {...props} />,
  code: ({ className, ...props }) => <code className={cn('rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.88em] text-foreground', className)} {...props} />,
  pre: MarkdownCodeBlock,
  table: ({ className, ...props }) => <div className="scrollbar-thin my-5 overflow-x-auto rounded-xl border"><table className={cn('w-full min-w-[32rem] border-collapse text-left text-sm', className)} {...props} /></div>,
  th: ({ className, ...props }) => <th className={cn('border-b bg-muted/70 px-3.5 py-2.5 font-semibold', className)} {...props} />,
  td: ({ className, ...props }) => <td className={cn('border-b px-3.5 py-2.5 align-top', className)} {...props} />,
  hr: ({ className, ...props }) => <hr className={cn('my-6 border-border', className)} {...props} />,
  input: ({ className, ...props }) => <input className={cn('mr-2 size-3.5 accent-primary', className)} {...props} />,
}

export const ContentMarkdown = memo(function ContentMarkdown({ isStreaming, text }: ContentMarkdownProps) {
  return (
    <div className="min-w-0 text-[15px] text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {text}
      </ReactMarkdown>
      {isStreaming && text && <span aria-label="AI 正在生成" className="mt-1 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle" />}
    </div>
  )
})
