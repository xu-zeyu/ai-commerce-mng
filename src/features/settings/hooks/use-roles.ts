import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoleList } from '../api/get-role-list'
import { getRolePage } from '../api/get-role-page'
import { getRoleById } from '../api/get-role-by-id'
import { createRole } from '../api/create-role'
import { updateRole } from '../api/update-role'
import { deleteRole } from '../api/delete-role'
import { getRolePermissions } from '../api/get-role-permissions'
import { assignRolePermissions } from '../api/assign-role-permissions'
import { syncPermissions } from '../api/sync-permissions'
import { getPermissionSyncPayload } from '../lib/admin-permissions'
import type { RolePageParams } from '../types'

export function useRoleList() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoleList,
  })
}

export function useRolePage(params: RolePageParams) {
  return useQuery({
    queryKey: ['roles', 'page', params],
    queryFn: () => getRolePage(params),
  })
}

export function useRoleDetail(roleId: number | null) {
  return useQuery({
    queryKey: ['roles', 'detail', roleId],
    queryFn: () => getRoleById(roleId!),
    enabled: roleId !== null,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  })
}

export function useRolePermissions(roleId: number | null) {
  return useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: () => getRolePermissions(roleId!),
    enabled: roleId !== null,
  })
}

export function useAssignRolePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assignRolePermissions,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['role-permissions', variables.roleId] })
    },
  })
}

export function useSyncPermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => syncPermissions(getPermissionSyncPayload()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  })
}
