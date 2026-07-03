'use client'

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileUpload } from '@/features/file/components/file-upload'
import { cn } from '@/lib/utils'
import {
  useCreateProductImage,
  useDeleteProductImage,
  useProductImagePage,
  useUpdateProductImage,
} from '../hooks/use-product-images'
import { PRODUCT_IMAGE_CREATE_CODES, PRODUCT_IMAGE_UPDATE_CODES, PRODUCT_IMAGE_DELETE_CODES } from '../lib/product-permissions'
import { IMAGE_TYPE, IMAGE_TYPE_LABELS, type ProductImageType, type ProductSpuImage } from '../types'

// ---------------------------------------------------------------------------
// 图片类型配置
// ---------------------------------------------------------------------------

const IMAGE_TYPE_TABS: { type: ProductImageType; label: string; maxFiles: number }[] = [
  { type: IMAGE_TYPE.MAIN, label: IMAGE_TYPE_LABELS[IMAGE_TYPE.MAIN], maxFiles: 1 },
  { type: IMAGE_TYPE.CAROUSEL, label: IMAGE_TYPE_LABELS[IMAGE_TYPE.CAROUSEL], maxFiles: 8 },
  { type: IMAGE_TYPE.DETAIL, label: IMAGE_TYPE_LABELS[IMAGE_TYPE.DETAIL], maxFiles: 20 },
]

function getTypeConfig(type: ProductImageType) {
  return IMAGE_TYPE_TABS.find((t) => t.type === type) ?? IMAGE_TYPE_TABS[0]
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  open: boolean
  onClose: () => void
  spuId: number
  productName: string
}

// ---------------------------------------------------------------------------
// 图片预览弹窗
// ---------------------------------------------------------------------------

function ImagePreviewDialog({
  url,
  open,
  onClose,
}: {
  url: string | null
  open: boolean
  onClose: () => void
}) {
  if (!url) return null
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
        <button
          type="button"
          className="absolute -top-10 right-0 text-sm text-white/80 hover:text-white"
          onClick={onClose}
        >
          关闭
        </button>
        <img
          src={url}
          alt="预览"
          className="max-h-[80vh] w-full rounded-2xl object-contain"
        />
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// 单张图片卡片
// ---------------------------------------------------------------------------

function ImageCard({
  url,
  disabled,
  onPreview,
  onRemove,
}: {
  url: string
  disabled: boolean
  onPreview: (url: string) => void
  onRemove: (url: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      className="group relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm"
    >
      <img
        src={url}
        alt="商品图片"
        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* hover 遮罩 */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/35 group-hover:opacity-100">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="size-8 rounded-full bg-card/95 shadow-sm backdrop-blur"
          onClick={() => onPreview(url)}
          aria-label="预览图片"
        >
          <Eye className="size-4" />
        </Button>
        {!disabled && (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="size-8 rounded-full bg-card/95 text-destructive shadow-sm backdrop-blur hover:text-destructive"
            onClick={() => onRemove(url)}
            aria-label="删除图片"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// 主组件
// ---------------------------------------------------------------------------

export function ProductImageManager({ open, onClose, spuId, productName }: Props) {
  const [activeTab, setActiveTab] = useState<ProductImageType>(IMAGE_TYPE.MAIN)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const tabConfig = getTypeConfig(activeTab)

  // 查询当前 tab 对应图片类型的记录
  const pageQuery = useProductImagePage({
    page: 1,
    size: 1,
    spuId,
    imageType: activeTab,
  })

  const existingRecord: ProductSpuImage | null = pageQuery.data?.records?.[0] ?? null
  const savedUrls = existingRecord?.imageUrls ?? []

  // 本地编辑中的 URL 列表
  const [localUrls, setLocalUrls] = useState<string[]>([])

  // 弹窗打开或 tab 切换时重置本地状态
  useEffect(() => {
    if (open) {
      setLocalUrls([...savedUrls])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab, existingRecord?.id])

  // 关闭时重置
  useEffect(() => {
    if (!open) {
      setActiveTab(IMAGE_TYPE.MAIN)
      setPreviewUrl(null)
    }
  }, [open])

  const isDirty = useMemo(() => {
    if (savedUrls.length !== localUrls.length) return true
    return savedUrls.some((url, i) => url !== localUrls[i])
  }, [savedUrls, localUrls])

  const createMutation = useCreateProductImage()
  const updateMutation = useUpdateProductImage()
  const deleteMutation = useDeleteProductImage()
  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  // 保存
  const handleSave = useCallback(async () => {
    if (localUrls.length === 0) {
      // 如果清空了所有图片且存在旧记录 → 删除记录
      if (existingRecord) {
        await deleteMutation.mutateAsync(existingRecord.id)
        toast.success('图片已清空')
      }
      return
    }

    const payload = {
      spuId,
      imageType: activeTab,
      imageUrls: localUrls,
    }

    if (existingRecord) {
      await updateMutation.mutateAsync({ id: existingRecord.id, ...payload })
      toast.success('图片更新成功')
    } else {
      await createMutation.mutateAsync(payload)
      toast.success('图片保存成功')
    }
  }, [localUrls, existingRecord, spuId, activeTab, deleteMutation, updateMutation, createMutation])

  // 删除单张图片（仅从本地状态移除，需点保存才持久化）
  const handleRemoveUrl = useCallback((url: string) => {
    setLocalUrls((prev) => prev.filter((u) => u !== url))
  }, [])

  // FileUpload 的 onChange
  const handleUrlsChange = useCallback(
    (urls: string[]) => {
      setLocalUrls(urls)
    },
    [],
  )

  const canUpload = localUrls.length < tabConfig.maxFiles && !saving

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate">
            商品图片 · {productName}
          </DialogTitle>
        </DialogHeader>

        {/* Tab 切换 */}
        <div className="flex items-center gap-1 rounded-2xl bg-muted/60 p-1">
          {IMAGE_TYPE_TABS.map((tab) => (
            <button
              key={tab.type}
              type="button"
              onClick={() => setActiveTab(tab.type)}
              className={cn(
                'flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                activeTab === tab.type
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              <span className="ml-1 text-xs text-muted-foreground">
                {tab.type === activeTab ? localUrls.length : ''}
              </span>
            </button>
          ))}
        </div>

        {/* 图片列表 */}
        <div className="min-h-[160px] space-y-3">
          {pageQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {localUrls.length > 0 && (
                  <motion.div
                    key="grid"
                    className="grid grid-cols-[repeat(auto-fill,minmax(104px,112px))] gap-3"
                  >
                    {localUrls.map((url) => (
                      <ImageCard
                        key={url}
                        url={url}
                        disabled={saving}
                        onPreview={setPreviewUrl}
                        onRemove={handleRemoveUrl}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {localUrls.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <ImagePlus className="size-10 opacity-30" />
                  <p className="mt-2 text-sm">暂无{tabConfig.label}</p>
                  <p className="text-xs text-muted-foreground/70">点击下方区域上传</p>
                </div>
              )}

              {/* 上传区域 */}
              {canUpload && (
                <FileUpload
                  value={localUrls}
                  onChange={handleUrlsChange}
                  multiple={tabConfig.maxFiles > 1}
                  maxFiles={tabConfig.maxFiles}
                  disabled={saving}
                  emptyTitle={`上传${tabConfig.label}`}
                  emptyDescription={
                    tabConfig.maxFiles > 1
                      ? `最多 ${tabConfig.maxFiles} 张 · 单张不超过 8 MB`
                      : '仅支持一张 · 不超过 8 MB'
                  }
                />
              )}

              {!canUpload && localUrls.length >= tabConfig.maxFiles && (
                <p className="text-center text-xs text-muted-foreground">
                  已达到{tabConfig.label}数量上限（{tabConfig.maxFiles} 张），请先删除再上传
                </p>
              )}
            </>
          )}
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {pageQuery.isLoading
              ? '加载中...'
              : existingRecord
                ? `已保存 ${savedUrls.length} 张`
                : '未保存'}
            {isDirty && !pageQuery.isLoading && (
              <span className="ml-1 text-amber-600">（有修改）</span>
            )}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              取消
            </Button>
            <Button
              type="button"
              permission={
                existingRecord
                  ? PRODUCT_IMAGE_UPDATE_CODES
                  : PRODUCT_IMAGE_CREATE_CODES
              }
              onClick={handleSave}
              disabled={saving || !isDirty}
            >
              {saving && <Loader2 className="mr-1 size-4 animate-spin" />}
              保存
            </Button>
          </div>
        </div>

        {/* 预览弹窗 */}
        <ImagePreviewDialog
          url={previewUrl}
          open={!!previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      </DialogContent>
    </Dialog>
  )
}
