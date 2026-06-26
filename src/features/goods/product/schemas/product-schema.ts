import { z } from 'zod'

const optionalString = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(''))

export const productSchema = z.object({
  supplierId: z.coerce.number().int().positive('请选择供应商'),
  spuCode: z.string().trim().min(1, '请输入SPU编码').max(64, 'SPU编码最多 64 个字符'),
  name: z.string().trim().min(1, '请输入商品名称').max(120, '商品名称最多 120 个字符'),
  subTitle: optionalString(150, '副标题最多 150 个字符'),
  categoryId: z.coerce.number().int().positive('请选择分类'),
  brandId: z.coerce.number().int().positive('请选择品牌'),
  saleStatus: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1)])),
  auditStatus: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1), z.literal(2)])),
  sort: z.coerce.number().int('排序需为整数').min(0, '排序不能小于 0').max(99999, '排序值过大'),
  salesCount: z.coerce.number().int('销量需为整数').min(0, '销量不能小于 0'),
})

export type ProductFormValues = z.infer<typeof productSchema>
