import { SKU_STATUS, type SkuStatus } from '../types'

export const SKU_STATUS_OPTIONS: { value: SkuStatus; label: string }[] = [
  { value: SKU_STATUS.ENABLED, label: '启用' },
  { value: SKU_STATUS.DISABLED, label: '禁用' },
]
