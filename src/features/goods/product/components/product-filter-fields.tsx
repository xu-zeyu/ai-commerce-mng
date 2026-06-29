'use client'

import {
  DataTableFilterField,
  DataTableFilterGroup,
  DataTableFilterInput,
  DataTableFilterSelect,
} from '@/components/common/data-table-filters'
import {
  AUDIT_STATUS_OPTIONS,
  SALE_STATUS_OPTIONS,
} from '../lib/product-status'
import type { AuditStatus, ProductOption, SaleStatus } from '../types'

type SaleStatusFilter = 'all' | SaleStatus
type AuditStatusFilter = 'all' | AuditStatus

interface ProductFilterFieldsProps {
  spuCode: string
  supplierId: number
  categoryId: number
  brandId: number
  saleStatus: SaleStatusFilter
  auditStatus: AuditStatusFilter
  suppliers?: ProductOption[]
  categories?: ProductOption[]
  brands?: ProductOption[]
  onSpuCodeChange: (value: string) => void
  onSupplierChange: (value: number) => void
  onCategoryChange: (value: number) => void
  onBrandChange: (value: number) => void
  onSaleStatusChange: (value: SaleStatusFilter) => void
  onAuditStatusChange: (value: AuditStatusFilter) => void
}

export function ProductFilterFields({
  spuCode,
  supplierId,
  categoryId,
  brandId,
  saleStatus,
  auditStatus,
  suppliers,
  categories,
  brands,
  onSpuCodeChange,
  onSupplierChange,
  onCategoryChange,
  onBrandChange,
  onSaleStatusChange,
  onAuditStatusChange,
}: ProductFilterFieldsProps) {
  return (
    <DataTableFilterGroup>
      <DataTableFilterField label="SPU 编码">
        <DataTableFilterInput
          value={spuCode}
          onChange={(event) => onSpuCodeChange(event.target.value)}
          placeholder="输入 SPU 编码"
        />
      </DataTableFilterField>

      <DataTableFilterField label="供应商">
        <DataTableFilterSelect
          value={String(supplierId)}
          onValueChange={(value) => onSupplierChange(Number(value))}
          options={[
            { value: '0', label: '全部供应商' },
            ...(suppliers?.map((supplier) => ({
              value: String(supplier.id),
              label: supplier.label,
            })) ?? []),
          ]}
        />
      </DataTableFilterField>

      <DataTableFilterField label="分类">
        <DataTableFilterSelect
          value={String(categoryId)}
          onValueChange={(value) => onCategoryChange(Number(value))}
          options={[
            { value: '0', label: '全部分类' },
            ...(categories?.map((category) => ({
              value: String(category.id),
              label: category.label,
            })) ?? []),
          ]}
        />
      </DataTableFilterField>

      <DataTableFilterField label="品牌">
        <DataTableFilterSelect
          value={String(brandId)}
          onValueChange={(value) => onBrandChange(Number(value))}
          options={[
            { value: '0', label: '全部品牌' },
            ...(brands?.map((brand) => ({
              value: String(brand.id),
              label: brand.label,
            })) ?? []),
          ]}
        />
      </DataTableFilterField>

      <DataTableFilterField label="销售状态">
        <DataTableFilterSelect
          value={saleStatus === 'all' ? 'all' : String(saleStatus)}
          onValueChange={(value) =>
            onSaleStatusChange(
              value === 'all'
                ? 'all'
                : (value as SaleStatus),
            )
          }
          options={[
            { value: 'all', label: '全部销售状态' },
            ...SALE_STATUS_OPTIONS.map((option) => ({
              value: String(option.value),
              label: option.label,
            })),
          ]}
        />
      </DataTableFilterField>

      <DataTableFilterField label="审核状态">
        <DataTableFilterSelect
          value={auditStatus === 'all' ? 'all' : String(auditStatus)}
          onValueChange={(value) =>
            onAuditStatusChange(
              value === 'all'
                ? 'all'
                : (value as AuditStatus),
            )
          }
          options={[
            { value: 'all', label: '全部审核状态' },
            ...AUDIT_STATUS_OPTIONS.map((option) => ({
              value: String(option.value),
              label: option.label,
            })),
          ]}
        />
      </DataTableFilterField>
    </DataTableFilterGroup>
  )
}
