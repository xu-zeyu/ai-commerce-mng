import { request } from '@/services/request'

export async function deletePermission(id: number): Promise<void> {
  await request.delete(`/admin/permission/${id}`)
}
