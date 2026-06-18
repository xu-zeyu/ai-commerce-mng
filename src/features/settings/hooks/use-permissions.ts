import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPermissionList } from '../api/get-permission-list'
import { createPermission } from '../api/create-permission'
import { updatePermission } from '../api/update-permission'
import { deletePermission } from '../api/delete-permission'

export function usePermissionList() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissionList,
  })
}

export function useCreatePermission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  })
}

export function useUpdatePermission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updatePermission,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  })
}

export function useDeletePermission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  })
}
