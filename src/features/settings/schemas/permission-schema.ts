import { z } from 'zod'

export const permissionSchema = z.object({
  name: z.string().min(1, '请输入权限名称'),
  code: z.string().min(1, '请输入权限编码'),
})

export type PermissionFormValues = z.infer<typeof permissionSchema>
