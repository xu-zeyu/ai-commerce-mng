import { request } from '@/services/request'
import type { ApiResult } from '@/services/types'
import type { ProductOption } from '../types'

interface PageRecords<T> {
  records: T[]
  total: number
}

interface SupplierRecord {
  id: number
  supplierName: string
  supplierCode?: string | null
}

interface BrandRecord {
  id: number
  name: string
}

interface CategoryTreeNode {
  id: number
  name: string
  children?: CategoryTreeNode[]
}

/** 供应商下拉选项 */
export async function getSupplierOptions(): Promise<ProductOption[]> {
  const res: ApiResult<PageRecords<SupplierRecord>> = await request.get('/supplier/page', {
    params: { page: 1, size: 1000 },
  })
  return (res.data.records ?? []).map((item) => ({
    id: item.id,
    label: item.supplierCode ? `${item.supplierName}（${item.supplierCode}）` : item.supplierName,
  }))
}

/** 品牌下拉选项 */
export async function getBrandOptions(): Promise<ProductOption[]> {
  const res: ApiResult<PageRecords<BrandRecord>> = await request.get('/goods/brand/page', {
    params: { page: 1, size: 1000 },
  })
  return (res.data.records ?? []).map((item) => ({ id: item.id, label: item.name }))
}

/** 分类下拉选项（拍平树形结构，保留层级路径） */
export async function getCategoryOptions(): Promise<ProductOption[]> {
  const res: ApiResult<CategoryTreeNode[]> = await request.get('/goods/category/tree')

  const flatten = (nodes: CategoryTreeNode[], parentPath = ''): ProductOption[] =>
    nodes.flatMap((node) => {
      const label = parentPath ? `${parentPath} > ${node.name}` : node.name
      const current: ProductOption = { id: node.id, label }
      return node.children?.length ? [current, ...flatten(node.children, label)] : [current]
    })

  return flatten(res.data ?? [])
}
