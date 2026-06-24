export type CategoryStatus = 0 | 1

export interface GoodsCategory {
  id: number
  parentId: number
  name: string
  level: number
  sort?: number | null
  icon: string
  status: CategoryStatus
  createdTime?: string
  updatedTime?: string
}

export interface GoodsCategoryTreeNode extends GoodsCategory {
  children?: GoodsCategoryTreeNode[]
}

export interface CategoryPageParams {
  page: number
  size: number
  parentId: number
  name?: string
}

export interface CategoryPageResult {
  records: GoodsCategory[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface CreateCategoryPayload {
  parent_id: number
  name: string
  icon: string
  level: number
  sort?: number
  status: CategoryStatus
}

export type UpdateCategoryPayload = CreateCategoryPayload

// ---------- 品牌 ----------

export interface GoodsBrand {
  id: number
  name: string
  logo?: string | null
  firstLetter?: string | null
  categoryId: number
  sort?: number | null
  status: 0 | 1
  createdTime?: string
  updatedTime?: string
}

export interface BrandPageParams {
  page: number
  size: number
  categoryId: number
  name?: string
  status?: 0 | 1
}

export interface BrandPageResult {
  records: GoodsBrand[]
  total: number
  size: number
  current: number
  pages?: number
}

export interface CreateBrandPayload {
  name: string
  logo?: string
  firstLetter?: string
  categoryId: number
  sort?: number
  status: 0 | 1
}

export type UpdateBrandPayload = CreateBrandPayload
