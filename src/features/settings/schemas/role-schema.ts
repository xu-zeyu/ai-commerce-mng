import { z } from 'zod'

export const roleSchema = z.object({
  rname: z.string().min(1, '请输入角色名称'),
  description: z.string().optional(),
})

export type RoleFormValues = z.infer<typeof roleSchema>
