'use client'

/* eslint-disable @next/next/no-img-element */

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { FileUploadItem } from '../types'

interface FileUploadPreviewDialogProps {
  item: FileUploadItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FileUploadPreviewDialog({
  item,
  open,
  onOpenChange,
}: FileUploadPreviewDialogProps) {
  const imageUrl = item?.url ?? item?.thumbUrl

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-4 overflow-hidden p-4 sm:max-w-3xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="truncate text-base">{item?.name ?? '图片预览'}</DialogTitle>
          <DialogDescription>查看上传图片的原始预览</DialogDescription>
        </DialogHeader>

        {imageUrl && (
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted">
            <img
              src={imageUrl}
              alt={item?.name ?? '图片预览'}
              className="max-h-[66vh] w-full object-contain"
            />
          </div>
        )}

        {item?.url && (
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" asChild>
              <a href={item.url} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
                打开原图
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
