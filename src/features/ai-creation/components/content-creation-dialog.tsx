'use client'

import { WandSparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ContentCreationValues } from '../schemas/content-creation-schema'
import { ContentCreationForm } from './content-creation-form'

interface ContentCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ContentCreationValues) => Promise<void>
  originPoint?: { x: number; y: number } | null
}

export function ContentCreationDialog({ open, onOpenChange, onSubmit, originPoint }: ContentCreationDialogProps) {
  const submit = async (values: ContentCreationValues) => {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent originPoint={originPoint}>
        <DialogHeader className="pr-8">
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <WandSparkles className="size-5" />
          </div>
          <DialogTitle>创作设置</DialogTitle>
          <DialogDescription>填写主题、内容风格和目标受众，AI 将实时生成完整内容。</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <ContentCreationForm onSubmit={submit} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
