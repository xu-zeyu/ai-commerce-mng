import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().trim().min(1, '请输入分类名称').max(30, '分类名称最多 30 个字符'),
  parentId: z.coerce.number().int().min(0),
  icon: z.string().trim().min(1, '请输入分类图标').max(40, '图标内容过长'),
  sort: z.coerce.number().int().min(0, '排序不能小于 0').max(9999, '排序不能超过 9999'),
  status: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1)])),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
