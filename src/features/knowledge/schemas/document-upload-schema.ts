import { z } from 'zod'

export const MAX_MARKDOWN_SIZE = 10 * 1024 * 1024

export const documentUploadSchema = z.object({
  file: z
    .custom<File>(
      (value) => typeof File !== 'undefined' && value instanceof File,
      '请选择 Markdown 文档',
    )
    .refine((file) => file.name.toLowerCase().endsWith('.md'), '仅支持 .md 文件')
    .refine((file) => file.size <= MAX_MARKDOWN_SIZE, '文件不能超过 10 MB'),
})

export type DocumentUploadValues = z.infer<typeof documentUploadSchema>
