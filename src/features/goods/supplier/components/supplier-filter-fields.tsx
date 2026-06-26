'use client'

import {
  DataTableFilterField,
  DataTableFilterGroup,
  DataTableFilterSelect,
} from '@/components/common/data-table-filters'
import type { SupplierStatus } from '../types'

type StatusFilter = 'all' | SupplierStatus

interface SupplierFilterFieldsProps {
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
}

export function SupplierFilterFields({
  status,
  onStatusChange,
}: SupplierFilterFieldsProps) {
  return (
    <DataTableFilterGroup className="2xl:grid-cols-4">
      <DataTableFilterField label="状态">
        <DataTableFilterSelect
          value={status === 'all' ? 'all' : String(status)}
          onValueChange={(value) =>
            onStatusChange(
              value === 'all'
                ? 'all'
                : (Number(value) as SupplierStatus),
            )
          }
          options={[
            { value: 'all', label: '全部状态' },
            { value: '1', label: '启用' },
            { value: '0', label: '停用' },
          ]}
        />
      </DataTableFilterField>
    </DataTableFilterGroup>
  )
}
