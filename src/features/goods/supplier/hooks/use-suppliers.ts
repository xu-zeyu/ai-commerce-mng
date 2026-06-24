import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSupplier } from '../api/create-supplier'
import { deleteSupplier } from '../api/delete-supplier'
import { getSupplierPage } from '../api/get-supplier-page'
import { updateSupplier } from '../api/update-supplier'
import type { SupplierPageParams } from '../types'

const SUPPLIER_QUERY_KEY = ['goods-suppliers'] as const

export function useSupplierPage(params: SupplierPageParams) {
  return useQuery({
    queryKey: [...SUPPLIER_QUERY_KEY, 'page', params],
    queryFn: () => getSupplierPage(params),
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIER_QUERY_KEY }),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIER_QUERY_KEY }),
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SUPPLIER_QUERY_KEY }),
  })
}
