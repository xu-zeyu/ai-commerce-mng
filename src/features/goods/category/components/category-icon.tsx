'use client'

import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value?: string | null
  name: string
  className?: string
}

const imageExtensions = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i

function isImageSource(value: string) {
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    (value.startsWith('/') && !value.startsWith('//')) ||
    value.startsWith('data:image/') ||
    imageExtensions.test(value)
  )
}

function normalizeImageSource(value: string) {
  if (value.startsWith('//')) {
    return `https:${value}`
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/') ||
    value.startsWith('data:image/')
  ) {
    return value
  }

  return `/${value.replace(/^\.?\//, '')}`
}

export function CategoryIcon({ value, name, className }: Props) {
  const icon = value?.trim()

  if (!icon) {
    return (
      <span className={cn('flex items-center justify-center rounded-2xl bg-secondary text-primary', className)}>
        <ImageIcon className="size-4" />
      </span>
    )
  }

  if (isImageSource(icon)) {
    const imageSrc = normalizeImageSource(icon)

    return (
      <span className={cn('relative  bg-white size-5', className)}>
        <Image
          src={imageSrc}
          alt={`${name} 分类图标`}
          fill
          sizes="34px"
          className="object-contain"
          unoptimized={imageSrc.startsWith('data:image/') || imageSrc.endsWith('.svg')}
        />
      </span>
    )
  }

  return (
    <span className={cn('flex items-center justify-center rounded-2xl bg-secondary text-xl', className)}>
      {icon}
    </span>
  )
}
