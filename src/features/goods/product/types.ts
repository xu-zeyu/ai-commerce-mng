/** 商品分页销售状态 */
export type SaleStatus = 'OFF_SHELF' | 'ON_SHELF'

/** 商品分页审核状态 */
export type AuditStatus = 'PENDING' | 'PASS' | 'REJECT'

/** 创建/编辑商品销售状态：0-下架 1-上架 */
export type ProductFormSaleStatus = 0 | 1

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
  /** 销售状态：OFF_SHELF-下架 ON_SHELF-上架 */
  saleStatus: SaleStatus
  /** 审核状态：PENDING-待审核 PASS-审核通过 REJECT-审核拒绝 */
  auditStatus: AuditStatus
  /** 排序值 */
  sort?: number | null
  /** 主图 URL 列表 */
  mainImage?: string[] | null
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
  saleStatus: ProductFormSaleStatus
  sort?: number
}

export type UpdateProductPayload = CreateProductPayload

/** 下拉选项通用结构 */
export interface ProductOption {
  id: number
  label: string
}

/** 商品图片类型，对齐后端 ImageTypeEnum */
export const IMAGE_TYPE = {
  MAIN: "MAIN",
  CAROUSEL: "CAROUSEL",
  DETAIL: "DETAIL",
} as const

export type ProductImageType = (typeof IMAGE_TYPE)[keyof typeof IMAGE_TYPE]

/** 图片类型标签映射 */
export const IMAGE_TYPE_LABELS: Record<ProductImageType, string> = {
  [IMAGE_TYPE.MAIN]: '主图',
  [IMAGE_TYPE.CAROUSEL]: '轮播图',
  [IMAGE_TYPE.DETAIL]: '详情图',
}

/** 商品SPU图片记录 */
export interface ProductSpuImage {
  id: number
  /** 所属SPU ID */
  spuId: number
  /** 图片类型：1-主图 2-轮播图 3-详情图 */
  imageType: ProductImageType
  /** 图片地址数组 */
  imageUrls: string[]
  createdTime?: string
  updatedTime?: string
}

export interface ProductImagePageParams {
  page: number
  size: number
  /** SPU ID筛选 */
  spuId?: number
  /** 图片类型筛选 */
  imageType?: number
}

export interface ProductImagePageResult {
  records: ProductSpuImage[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface ProductImagePayload {
  spuId: number
  imageType: ProductImageType
  imageUrls: string[]
}

// ─── SKU ────────────────────────────────────────────

/** SKU 状态，对齐后端 SkuStatusEnum */
export const SKU_STATUS = {
  DISABLED: 'DISABLED',
  ENABLED: 'ENABLED',
} as const

export type SkuStatus = (typeof SKU_STATUS)[keyof typeof SKU_STATUS]

/** SKU 状态标签映射 */
export const SKU_STATUS_LABELS: Record<SkuStatus, string> = {
  [SKU_STATUS.DISABLED]: '禁用',
  [SKU_STATUS.ENABLED]: '启用',
}

export interface ProductSku {
  id: number
  /** 所属 SPU ID */
  spuId: number
  /** SKU 编码 */
  skuCode: string
  /** 规格信息 JSON */
  specInfo?: string | null
  /** SKU 图片 URL */
  image?: string | null
  /** 售价 */
  price: number
  /** 原价 */
  originalPrice?: number | null
  /** 库存 */
  stock: number
  /** 销量 */
  salesCount?: number
  /** 状态：DISABLED-禁用 ENABLED-启用 */
  status: SkuStatus
  createdTime?: string
  updatedTime?: string
}

export interface ProductSkuPageParams {
  page: number
  size: number
  /** SPU ID 筛选 */
  spuId?: number
}

export interface ProductSkuPageResult {
  records: ProductSku[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface CreateProductSkuPayload {
  spuId: number
  skuCode: string
  specInfo?: string
  image?: string
  price: number
  originalPrice?: number
  stock: number
  status: SkuStatus
}

export type UpdateProductSkuPayload = CreateProductSkuPayload



