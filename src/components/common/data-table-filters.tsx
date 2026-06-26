'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'
import {
  SelectControl,
  type SelectControlOption,
} from '@/components/common/select-control'
import { cn } from '@/lib/utils'

interface DataTableFilterGroupProps {
  children: ReactNode
  className?: string
}

interface DataTableFilterFieldProps {
  label: string
  children: ReactNode
  className?: string
}

interface DataTableFilterSelectProps {
  value: string
  options: SelectControlOption[]
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DataTableFilterGroup({
  children,
  className,
}: DataTableFilterGroupProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DataTableFilterField({
  label,
  children,
  className,
}: DataTableFilterFieldProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1.5 sm:grid sm:grid-cols-[72px_minmax(0,1fr)] sm:items-center sm:gap-3',
        className,
      )}
    >
      <span className="text-xs font-medium text-muted-foreground sm:justify-self-end sm:text-right">
        {label}
      </span>
      {children}
    </div>
  )
}

export function DataTableFilterInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-input/80 bg-background/80 px-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function DataTableFilterSelect({
  value,
  options,
  onValueChange,
  placeholder,
  disabled,
  className,
}: DataTableFilterSelectProps) {
  return (
    <SelectControl
      value={value}
      options={options}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn('bg-background/80', className)}
    />
  )
}
