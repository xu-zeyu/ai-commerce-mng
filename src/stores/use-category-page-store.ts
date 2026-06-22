import { create } from 'zustand'

interface CategoryPageState {
  parentId: number
  page: number
  pageSize: number
  setParentId: (parentId: number) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
}

export const useCategoryPageStore = create<CategoryPageState>((set) => ({
  parentId: 0,
  page: 1,
  pageSize: 12,
  setParentId: (parentId) => set({ parentId, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
}))
