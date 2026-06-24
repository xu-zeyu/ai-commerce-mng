export type SupplierStatus = 0 | 1

export interface Supplier {
  id: number
  /** 供应商编码 */
  supplierCode?: string | null
  /** 供应商名称 */
  supplierName: string
  /** 联系人 */
  contactName?: string | null
  /** 联系电话 */
  contactPhone?: string | null
  /** 邮箱 */
  email?: string | null
  /** 地址 */
  address?: string | null
  /** 状态：1 正常，0 禁用 */
  status: SupplierStatus
  /** 备注 */
  remark?: string | null
  createdTime?: string
  updatedTime?: string
}

export interface SupplierPageParams {
  page: number
  size: number
  /** 供应商名称（模糊搜索） */
  supplierName?: string
  /** 供应商编码（模糊搜索） */
  supplierCode?: string
  /** 按状态筛选 */
  status?: SupplierStatus
}

export interface SupplierPageResult {
  records: Supplier[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface CreateSupplierPayload {
  supplierCode: string
  supplierName: string
  contactName?: string
  contactPhone?: string
  email?: string
  address?: string
  status: SupplierStatus
  remark?: string
}

export type UpdateSupplierPayload = CreateSupplierPayload
