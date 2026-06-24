'use client'

import { useId, useMemo, useRef, useState, type DragEvent } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useBatchUploadFiles, useUploadFile } from '../hooks/use-file-upload'
import {
  DEFAULT_ACCEPT,
  DEFAULT_MAX_SIZE_MB,
  formatFileSize,
  isFileAccepted,
  isFileWithinSize,
} from '../lib/file-rules'
import { createPendingItems, getFileNameFromUrl, revokePreviewUrls } from '../lib/file-upload-items'
import type { FileUploadItem } from '../types'
import { FileUploadPreviewDialog } from './file-upload-preview-dialog'
import { FileUploadPreviewList } from './file-upload-preview-list'
import { FileUploadTriggerCard } from './file-upload-trigger-card'

interface FileUploadProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  multiple?: boolean
  accept?: string
  maxFiles?: number
  maxSizeMb?: number
  disabled?: boolean
  className?: string
  emptyTitle?: string
  emptyDescription?: string
}

export function FileUpload({
  value = [],
  onChange,
  multiple = false,
  accept = DEFAULT_ACCEPT,
  maxFiles = multiple ? 8 : 1,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
  disabled = false,
  className,
  emptyTitle = '上传图片',
  emptyDescription,
}: FileUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [pendingItems, setPendingItems] = useState<FileUploadItem[]>([])
  const [previewItem, setPreviewItem] = useState<FileUploadItem | null>(null)
  const singleUpload = useUploadFile()
  const batchUpload = useBatchUploadFiles()
  const uploading = singleUpload.isPending || batchUpload.isPending
  const locked = disabled || uploading
  const canAddMore = value.length + pendingItems.length < maxFiles
  const hint =
    emptyDescription ?? `${accept.replace('image/*', '图片')} · 单个不超过 ${maxSizeMb} MB`

  const items = useMemo<FileUploadItem[]>(
    () => [
      ...value.map((url) => ({
        uid: url,
        name: getFileNameFromUrl(url),
        status: 'done' as const,
        url,
        thumbUrl: url,
        percent: 100,
      })),
      ...pendingItems,
    ],
    [value, pendingItems],
  )

  const updateValue = (urls: string[]) => {
    onChange?.(multiple ? urls.slice(0, maxFiles) : urls.slice(0, 1))
  }

  const validateFiles = (files: File[]) => {
    const invalidType = files.find((file) => !isFileAccepted(file, accept))
    if (invalidType) {
      toast.error(`${invalidType.name} 文件类型不支持`)
      return false
    }

    const oversized = files.find((file) => !isFileWithinSize(file, maxSizeMb))
    if (oversized) {
      toast.error(`${oversized.name} 超过 ${formatFileSize(maxSizeMb * 1024 * 1024)}`)
      return false
    }

    return true
  }

  const uploadFiles = async (fileList: FileList | null) => {
    if (!fileList || locked) return

    const remaining = Math.max(maxFiles - value.length - pendingItems.length, 0)
    const files = Array.from(fileList).slice(0, multiple ? remaining : 1)

    if (files.length === 0) {
      toast.info(`最多上传 ${maxFiles} 个文件`)
      return
    }

    if (fileList.length > files.length) toast.info(`已按上限保留前 ${files.length} 个文件`)
    if (!validateFiles(files)) return

    const pending = createPendingItems(files)
    setPendingItems(pending)

    try {
      const uploadedUrls = multiple
        ? await batchUpload.mutateAsync(files)
        : [await singleUpload.mutateAsync(files[0])]

      updateValue(multiple ? [...value, ...uploadedUrls] : uploadedUrls)
      toast.success('图片上传成功')
    } catch {
      const pendingIds = new Set(pending.map((item) => item.uid))
      setPendingItems((current) =>
        current.map((item) =>
          pendingIds.has(item.uid) ? { ...item, status: 'error', percent: 100 } : item,
        ),
      )
      toast.error('图片上传失败，请重试')
      await new Promise<void>((resolve) => window.setTimeout(resolve, 900))
    } finally {
      revokePreviewUrls(pending)
      setPendingItems([])
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!locked && canAddMore) setDragActive(true)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    void uploadFiles(event.dataTransfer.files)
  }

  return (
    <div
      className={cn('space-y-2', className)}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={locked || !canAddMore}
        className="sr-only"
        onChange={(event) => void uploadFiles(event.target.files)}
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,112px))] gap-3">
        <FileUploadPreviewList
          items={items}
          disabled={locked}
          onPreview={setPreviewItem}
          onRemove={(url) => updateValue(value.filter((item) => item !== url))}
        />

        {canAddMore && (
          <FileUploadTriggerCard
            title={emptyTitle}
            count={value.length + pendingItems.length}
            maxFiles={maxFiles}
            uploading={uploading}
            dragActive={dragActive}
            disabled={locked}
            onClick={() => inputRef.current?.click()}
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground">{hint}</p>

      <FileUploadPreviewDialog
        item={previewItem}
        open={Boolean(previewItem)}
        onOpenChange={(open) => {
          if (!open) setPreviewItem(null)
        }}
      />
    </div>
  )
}
