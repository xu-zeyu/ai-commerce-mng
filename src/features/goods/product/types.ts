/** 销售状态：0-下架 1-上架 */
export type SaleStatus = 0 | 1

/** 审核状态：0-待审核 1-审核通过 2-审核拒绝 */
export type AuditStatus = 0 | 1 | 2

export interface ProductSpu {
  id: number
  /** 供应商ID */
  supplierId: number
  /** 供应商名称（前端映射） */
  supplierName?: string | null
  /** SPU编码，全平台唯一 */
  spuCode: string
  /** 商品名称 */
  name: string
  /** 商品副标题 */
  subTitle?: string | null
  /** 分类ID */
  categoryId: number
  /** 分类名称（前端映射） */
  categoryName?: string | null
  /** 品牌ID */
  brandId: number
  /** 品牌名称（前端映射） */
  brandName?: string | null
  /** 销售状态：0-下架 1-上架 */
  saleStatus: SaleStatus
  /** 审核状态：0-待审核 1-审核通过 2-审核拒绝 */
  auditStatus: AuditStatus
  /** 排序值 */
  sort?: number | null
  /** 销量 */
  salesCount?: number | null
  createdTime?: string
  updatedTime?: string
}

export interface ProductPageParams {
  page: number
  size: number
  /** 商品名称（模糊搜索） */
  name?: string
  /** SPU编码（模糊搜索） */
  spuCode?: string
  /** 供应商ID */
  supplierId?: number
  /** 分类ID */
  categoryId?: number
  /** 品牌ID */
  brandId?: number
  /** 销售状态 */
  saleStatus?: SaleStatus
  /** 审核状态 */
  auditStatus?: AuditStatus
}

export interface ProductPageResult {
  records: ProductSpu[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface CreateProductPayload {
  supplierId: number
  spuCode: string
  name: string
  subTitle?: string
  categoryId: number
  brandId: number
  saleStatus: SaleStatus
  auditStatus: AuditStatus
  sort?: number
  salesCount?: number
}

export type UpdateProductPayload = CreateProductPayload

/** 下拉选项通用结构 */
export interface ProductOption {
  id: number
  label: string
}
