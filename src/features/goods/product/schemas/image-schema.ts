import { z } from 'zod'
import { IMAGE_TYPE } from '../types'

export const imageSchema = z.object({
  spuId: z.coerce.number().int().positive('SPU ID 不能为空'),
  imageType: z.union([
    z.literal(IMAGE_TYPE.MAIN),
    z.literal(IMAGE_TYPE.CAROUSEL),
    z.literal(IMAGE_TYPE.DETAIL),
  ], { errorMap: () => ({ message: '请选择图片类型' }) }),
  imageUrls: z
    .array(z.string().trim().min(1, '图片地址不能为空'))
    .min(1, '请至少上传一张图片'),
})

export type ImageFormValues = z.infer<typeof imageSchema>
