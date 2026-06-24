import { z } from 'zod'

const optionalString = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(''))

export const supplierSchema = z.object({
  supplierCode: z.string().trim().min(1, '请输入供应商编码').max(50, '供应商编码最多 50 个字符'),
  supplierName: z.string().trim().min(1, '请输入供应商名称').max(80, '供应商名称最多 80 个字符'),
  contactName: optionalString(30, '联系人最多 30 个字符'),
  contactPhone: optionalString(30, '联系电话最多 30 个字符'),
  email: z
    .string()
    .trim()
    .max(100, '邮箱最多 100 个字符')
    .refine((value) => value.length === 0 || z.string().email().safeParse(value).success, '请输入正确的邮箱'),
  address: optionalString(200, '地址最多 200 个字符'),
  status: z.coerce.number().pipe(z.union([z.literal(0), z.literal(1)])),
  remark: optionalString(300, '备注最多 300 个字符'),
})

export type SupplierFormValues = z.infer<typeof supplierSchema>
