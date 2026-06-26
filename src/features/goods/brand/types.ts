export type BrandStatus = 0 | 1

export interface GoodsBrand {
  id: number
  name: string
  logo?: string | null
  firstLetter?: string | null
  categoryId: number
  sort?: number | null
  status: BrandStatus
  createdTime?: string
  updatedTime?: string
}

export interface BrandPageParams {
  page: number
  size: number
  name?: string
  categoryId?: number
  status?: BrandStatus
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
  status: BrandStatus
}

export type UpdateBrandPayload = CreateBrandPayload
