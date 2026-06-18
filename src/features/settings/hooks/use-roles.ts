import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoleList } from '../api/get-role-list'
import { createRole } from '../api/create-role'
import { updateRole } from '../api/update-role'
import { deleteRole } from '../api/delete-role'
import { getRolePermissions } from '../api/get-role-permissions'
import { assignRolePermissions } from '../api/assign-role-permissions'

export function useRoleList() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoleList,
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
