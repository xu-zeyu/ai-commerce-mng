'use client'

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Eye, FileImage, Loader2, Trash2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { FileUploadItem } from '../types'

interface FileUploadPreviewListProps {
  items: FileUploadItem[]
  disabled?: boolean
  onPreview: (item: FileUploadItem) => void
  onRemove: (url: string) => void
}

function getStatusMeta(status: FileUploadItem['status']) {
  if (status === 'uploading') {
    return {
      icon: <Loader2 className="size-3.5 animate-spin" />,
      label: '上传中',
      className: 'bg-primary/10 text-primary',
    }
  }

  if (status === 'error') {
    return {
      icon: <XCircle className="size-3.5" />,
      label: '失败',
      className: 'bg-destructive/10 text-destructive',
    }
  }

  return {
    icon: <CheckCircle2 className="size-3.5" />,
    label: '已上传',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  }
}

export function FileUploadPreviewList({
  items,
  disabled = false,
  onPreview,
  onRemove,
}: FileUploadPreviewListProps) {
  return (
    <AnimatePresence initial={false}>
      {items.map((item) => {
        const imageUrl = item.thumbUrl ?? item.url
        const statusMeta = getStatusMeta(item.status)
        const canPreview = Boolean(imageUrl)
        const canRemove = Boolean(item.url) && !disabled && item.status === 'done'

        return (
          <motion.div
            key={item.uid}
            layout
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.name}
                className={cn(
                  'size-full object-cover transition-transform duration-300',
                  item.status === 'done' && 'group-hover:scale-105',
                  item.status !== 'done' && 'opacity-75',
                )}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <FileImage className="size-8" />
              </div>
            )}

            <div
              className={cn(
                'absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium shadow-sm backdrop-blur',
                statusMeta.className,
              )}
            >
              {statusMeta.icon}
              <span className="truncate">{statusMeta.label}</span>
            </div>

            {item.status === 'uploading' && (
              <div className="absolute inset-x-3 bottom-3 h-1 overflow-hidden rounded-full bg-background/80">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: '18%' }}
                  animate={{ width: `${item.percent ?? 64}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            )}

            {item.status === 'done' && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/35 group-hover:opacity-100">
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="size-8 rounded-full bg-card/95 shadow-sm backdrop-blur"
                  disabled={!canPreview}
                  onClick={() => onPreview(item)}
                  aria-label="预览图片"
                >
                  <Eye className="size-4" />
                </Button>
                {canRemove && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-8 rounded-full bg-card/95 text-destructive shadow-sm backdrop-blur hover:text-destructive"
                    onClick={() => item.url && onRemove(item.url)}
                    aria-label="删除图片"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}
