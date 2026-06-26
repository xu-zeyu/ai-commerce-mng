import type { AuditStatus, SaleStatus } from '../types'

export const SALE_STATUS_OPTIONS: { value: SaleStatus; label: string }[] = [
  { value: 1, label: '上架' },
  { value: 0, label: '下架' },
]

export const AUDIT_STATUS_OPTIONS: { value: AuditStatus; label: string }[] = [
  { value: 0, label: '待审核' },
  { value: 1, label: '审核通过' },
  { value: 2, label: '审核拒绝' },
]

export const SALE_STATUS_LABEL: Record<SaleStatus, string> = {
  0: '下架',
  1: '上架',
}

export const AUDIT_STATUS_LABEL: Record<AuditStatus, string> = {
  0: '待审核',
  1: '审核通过',
  2: '审核拒绝',
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export const AUDIT_STATUS_VARIANT: Record<AuditStatus, BadgeVariant> = {
  0: 'secondary',
  1: 'default',
  2: 'destructive',
}
