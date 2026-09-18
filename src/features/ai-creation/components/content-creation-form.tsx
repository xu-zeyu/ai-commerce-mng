'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  contentCreationSchema,
  type ContentCreationValues,
} from '../schemas/content-creation-schema'

const STYLE_PRESETS = ['专业深度', '轻松活泼', '故事叙述', '简洁实用']
const AUDIENCE_PRESETS = ['职场人士', '企业管理者', '年轻消费者', '行业从业者']

interface ContentCreationFormProps {
  onSubmit: (values: ContentCreationValues) => Promise<void>
}

export function ContentCreationForm({ onSubmit }: ContentCreationFormProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    register,
    setValue,
  } = useForm<ContentCreationValues>({
    resolver: zodResolver(contentCreationSchema),
    defaultValues: { audience: '', style: '', topic: '' },
  })
  const style = useWatch({ control, name: 'style' })
  const audience = useWatch({ control, name: 'audience' })

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Field label="内容主题" error={errors.topic?.message}>
        <Textarea
          {...register('topic')}
          placeholder="例如：AI 如何帮助跨境电商品牌提升运营效率"
          maxLength={200}
        />
      </Field>

      <Field label="内容风格" error={errors.style?.message}>
        <Input {...register('style')} placeholder="输入或选择内容风格" />
        <PresetList
          options={STYLE_PRESETS}
          selected={style}
          onSelect={(value) => setValue('style', value, { shouldValidate: true })}
        />
      </Field>

      <Field label="目标受众" error={errors.audience?.message}>
        <Input {...register('audience')} placeholder="输入或选择目标受众" />
        <PresetList
          options={AUDIENCE_PRESETS}
          selected={audience}
          onSelect={(value) => setValue('audience', value, { shouldValidate: true })}
        />
      </Field>

      <Button type="submit" size="lg" className="w-full">
        <Sparkles className="size-4" />开始创作
      </Button>
    </form>
  )
}

function Field({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return (
    <div className="space-y-2.5">
      <Label>{label}<span className="ml-1 text-destructive">*</span></Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function PresetList({
  onSelect,
  options,
  selected,
}: {
  onSelect: (value: string) => void
  options: string[]
  selected: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            selected === option
              ? 'border-primary bg-primary/10 text-primary'
              : 'bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
