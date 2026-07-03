import { z } from 'zod'
import { SKU_STATUS } from '../types'

const optionalString = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(''))

export const skuSchema = z.object({
  spuId: z.coerce.number().int().positive('SPU ID 不能为空'),
  skuCode: z.string().trim().min(1, '请输入SKU编码').max(64, 'SKU编码最多 64 个字符'),
  specInfo: optionalString(500, '规格信息最多 500 个字符'),
  image: optionalString(500, '图片地址最多 500 个字符'),
  price: z.coerce.number().min(0.01, '售价不能小于 0.01'),
  originalPrice: z.coerce.number().min(0, '原价不能小于 0').optional(),
  stock: z.coerce.number().int('库存需为整数').min(0, '库存不能小于 0'),
  status: z.union([z.literal(SKU_STATUS.DISABLED), z.literal(SKU_STATUS.ENABLED)], {
    errorMap: () => ({ message: '请选择状态' }),
  }),
})

export type SkuFormValues = z.infer<typeof skuSchema>
