"use client"

import type { ReactNode } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectControlOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

interface SelectControlProps {
  value: string
  options: SelectControlOption[]
  onValueChange: (value: string) => void
  id?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  contentClassName?: string
  emptyLabel?: string
}

export function SelectControl({
  value,
  options,
  onValueChange,
  id,
  placeholder,
  disabled,
  className,
  contentClassName,
  emptyLabel = '暂无可选项',
}: SelectControlProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {options.length > 0 ? (
          options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))
        ) : (
          <div className={cn('px-3 py-6 text-center text-xs text-muted-foreground')}>
            {emptyLabel}
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
