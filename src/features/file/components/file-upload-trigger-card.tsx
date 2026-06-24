'use client'

import { motion } from 'framer-motion'
import { ImagePlus, Loader2, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadTriggerCardProps {
  title: string
  count: number
  maxFiles: number
  uploading: boolean
  dragActive: boolean
  disabled: boolean
  onClick: () => void
}

export function FileUploadTriggerCard({
  title,
  count,
  maxFiles,
  uploading,
  dragActive,
  disabled,
  onClick,
}: FileUploadTriggerCardProps) {
  return (
    <motion.button
      type="button"
      layout
      disabled={disabled}
      className={cn(
        'group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-card/85 p-3 text-center shadow-sm transition-all hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60',
        dragActive && 'border-primary/70 bg-primary/10',
      )}
      onClick={onClick}
      aria-label={title}
    >
      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
        {uploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : dragActive ? (
          <UploadCloud className="size-5" />
        ) : (
          <ImagePlus className="size-5" />
        )}
      </span>
      <span className="text-xs font-medium text-foreground">
        {uploading ? '上传中' : title}
      </span>
      <span className="text-[11px] text-muted-foreground">
        {count}/{maxFiles}
      </span>
    </motion.button>
  )
}
