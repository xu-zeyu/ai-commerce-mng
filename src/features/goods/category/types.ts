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

export interface UpdateCategoryPayload extends CreateCategoryPayload {
  id: number
}
