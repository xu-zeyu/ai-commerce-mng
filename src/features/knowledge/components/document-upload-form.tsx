'use client'

import { useState, type DragEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { CheckCircle2, FileText, LoaderCircle, UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  documentUploadSchema,
  type DocumentUploadValues,
} from '../schemas/document-upload-schema'
import { useUploadMarkdown } from '../hooks/use-upload-markdown'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function DocumentUploadForm() {
  const [isDragging, setIsDragging] = useState(false)
  const upload = useUploadMarkdown()
  const { control, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<DocumentUploadValues>({ resolver: zodResolver(documentUploadSchema) })
  const file = useWatch({ control, name: 'file' })

  const chooseDroppedFile = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) setValue('file', droppedFile, { shouldValidate: true })
  }

  const submit = async (values: DocumentUploadValues) => {
    try {
      await upload.mutateAsync(values.file)
      toast.success('文档已提交给 Agent')
      reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '上传失败')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Controller
        name="file"
        control={control}
        render={({ field: { onChange } }) => (
          <label
            className={cn(
              'group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition',
              isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/[0.03]',
            )}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={chooseDroppedFile}
          >
            <input
              type="file"
              accept=".md,text/markdown,text/plain"
              className="sr-only"
              onChange={(event) => onChange(event.target.files?.[0])}
            />
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-105">
              <UploadCloud className="size-6" />
            </div>
            <p className="mt-4 text-sm font-medium">拖放 Markdown 文档到此处</p>
            <p className="mt-1 text-xs text-muted-foreground">或点击选择文件，单个文件不超过 10 MB</p>
          </label>
        )}
      />

      {errors.file && <p className="text-sm text-destructive">{errors.file.message}</p>}
      {file && (
        <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
          <FileText className="size-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => reset()} disabled={upload.isPending}>
            <X className="size-4" /><span className="sr-only">移除文件</span>
          </Button>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={!file || upload.isPending}>
        {upload.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
        {upload.isPending ? '正在上传…' : '上传到 Agent'}
      </Button>

      {upload.isSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />最近一份文档已上传成功
        </div>
      )}
    </form>
  )
}
