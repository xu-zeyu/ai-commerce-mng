import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { PermissionSyncItem } from '../types'

export async function syncPermissions(permissions: PermissionSyncItem[]): Promise<void> {
  await request.post<ApiResult<void>>('/admin/permission/batchSync', { permissions })
}
