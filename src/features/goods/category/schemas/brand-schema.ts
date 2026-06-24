import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string().trim().min(1, '请输入品牌名称').max(30, '品牌名称最多 30 个字符'),
  logo: z.string().trim().max(500, 'Logo 地址最多 500 个字符').optional().or(z.literal('')),
  firstLetter: z.string().trim().max(1, '首字母仅 1 位').optional().or(z.literal('')),
  categoryId: z.coerce.number().int().min(1, '请选择所属分类'),
  sort: z.coerce.number().int().min(0, '排序不能小于 0').max(9999, '排序不能超过 9999'),
  status: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1)])),
})

export type BrandFormValues = z.infer<typeof brandSchema>
