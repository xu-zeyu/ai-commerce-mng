import { z } from 'zod'

export const contentCreationSchema = z.object({
  topic: z.string().trim().min(2, '请输入至少 2 个字的内容主题').max(200, '内容主题不能超过 200 字'),
  style: z.string().trim().min(1, '请输入内容风格').max(50, '内容风格不能超过 50 字'),
  audience: z.string().trim().min(1, '请输入目标受众').max(100, '目标受众不能超过 100 字'),
})

export type ContentCreationValues = z.infer<typeof contentCreationSchema>
