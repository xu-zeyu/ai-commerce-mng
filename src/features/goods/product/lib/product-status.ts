import type { AuditStatus, ProductFormSaleStatus, SaleStatus } from '../types'

export const SALE_STATUS_OPTIONS: { value: SaleStatus; label: string }[] = [
  { value: 'ON_SHELF', label: '上架' },
  { value: 'OFF_SHELF', label: '下架' },
]

export const AUDIT_STATUS_OPTIONS: { value: AuditStatus; label: string }[] = [
  { value: 'PENDING', label: '待审核' },
  { value: 'PASS', label: '审核通过' },
  { value: 'REJECT', label: '审核拒绝' },
]

export const PRODUCT_FORM_SALE_STATUS_OPTIONS: {
  value: ProductFormSaleStatus
  label: string
}[] = [
  { value: 1, label: '上架' },
  { value: 0, label: '下架' },
]

export const SALE_STATUS_LABEL: Record<SaleStatus, string> = {
  OFF_SHELF: '下架',
  ON_SHELF: '上架',
}

export const AUDIT_STATUS_LABEL: Record<AuditStatus, string> = {
  PENDING: '待审核',
  PASS: '审核通过',
  REJECT: '审核拒绝',
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export const AUDIT_STATUS_VARIANT: Record<AuditStatus, BadgeVariant> = {
  PENDING: 'secondary',
  PASS: 'default',
  REJECT: 'destructive',
}

export function toFormSaleStatus(status: SaleStatus | ProductFormSaleStatus): ProductFormSaleStatus {
  if (status === 'OFF_SHELF') return 0
  if (status === 'ON_SHELF') return 1
  return status
}
