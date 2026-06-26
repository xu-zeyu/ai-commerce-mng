'use client'

import * as React from 'react'
import { CalendarDays, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DateRangeValue = [string | null, string | null]

type DateRangeSize = 'default' | 'sm'
type DateRangeStatus = 'default' | 'error'

export interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: DateRangeValue | null
  defaultValue?: DateRangeValue | null
  onChange?: (value: DateRangeValue | null, dateStrings: [string, string]) => void
  placeholder?: [string, string]
  name?: [string, string]
  disabled?: boolean | [boolean, boolean]
  allowClear?: boolean
  min?: string
  max?: string
  size?: DateRangeSize
  status?: DateRangeStatus
  separator?: React.ReactNode
}

const EMPTY_VALUE: DateRangeValue = [null, null]
const DEFAULT_PLACEHOLDER: [string, string] = ['开始日期', '结束日期']

function normalizeValue(value?: DateRangeValue | null): DateRangeValue {
  return [value?.[0] ?? null, value?.[1] ?? null]
}

function toDateStrings(value: DateRangeValue): [string, string] {
  return [value[0] ?? '', value[1] ?? '']
}

function toNullableValue(value: DateRangeValue): DateRangeValue | null {
  return value[0] || value[1] ? value : null
}

function getDisabledState(disabled?: boolean | [boolean, boolean]) {
  if (Array.isArray(disabled)) return disabled
  return [Boolean(disabled), Boolean(disabled)] as const
}

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  name,
  disabled,
  allowClear = true,
  min,
  max,
  size = 'default',
  status = 'default',
  separator,
  className,
  id,
  ...props
}: DateRangePickerProps) {
  const isControlled = value !== undefined
  const [innerValue, setInnerValue] = React.useState<DateRangeValue>(() =>
    normalizeValue(defaultValue),
  )

  const currentValue = normalizeValue(isControlled ? value : innerValue)
  const dateStrings = toDateStrings(currentValue)
  const [startDisabled, endDisabled] = getDisabledState(disabled)
  const canClear = allowClear && (dateStrings[0] || dateStrings[1])

  const updateValue = (nextValue: DateRangeValue) => {
    const normalizedValue = normalizeValue(nextValue)
    const nextNullableValue = toNullableValue(normalizedValue)

    if (!isControlled) {
      setInnerValue(normalizedValue)
    }

    onChange?.(nextNullableValue, toDateStrings(normalizedValue))
  }

  const handleDateChange = (side: 'start' | 'end', nextDate: string) => {
    const nextValue: DateRangeValue =
      side === 'start'
        ? [nextDate || null, currentValue[1]]
        : [currentValue[0], nextDate || null]

    updateValue(nextValue)
  }

  const handleClear = () => {
    updateValue(EMPTY_VALUE)
  }

  return (
    <div
      className={cn(
        'group inline-flex w-full min-w-0 items-center rounded-xl border bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring sm:w-auto',
        size === 'sm' ? 'h-9 sm:min-w-[18rem]' : 'h-11 sm:min-w-[20rem]',
        status === 'error' ? 'border-destructive/70' : 'border-input',
        (startDisabled && endDisabled) && 'cursor-not-allowed opacity-60',
        className,
      )}
      data-empty={!dateStrings[0] && !dateStrings[1]}
      data-status={status}
      {...props}
    >
      <CalendarDays className="ml-3 size-4 shrink-0 text-muted-foreground" />
      <input
        id={id ? `${id}-start` : undefined}
        name={name?.[0]}
        type="date"
        value={dateStrings[0]}
        min={min}
        max={dateStrings[1] || max}
        disabled={startDisabled}
        aria-label={placeholder[0]}
        onChange={(event) => handleDateChange('start', event.target.value)}
        className={cn(
          'h-full w-0 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none [color-scheme:light] dark:[color-scheme:dark]',
          !dateStrings[0] && 'text-muted-foreground',
        )}
      />
      <span className="flex shrink-0 items-center text-muted-foreground">
        {separator ?? <ChevronRight className="size-4" />}
      </span>
      <input
        id={id ? `${id}-end` : undefined}
        name={name?.[1]}
        type="date"
        value={dateStrings[1]}
        min={dateStrings[0] || min}
        max={max}
        disabled={endDisabled}
        aria-label={placeholder[1]}
        onChange={(event) => handleDateChange('end', event.target.value)}
        className={cn(
          'h-full w-0 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none [color-scheme:light] dark:[color-scheme:dark]',
          !dateStrings[1] && 'text-muted-foreground',
        )}
      />
      {canClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={startDisabled && endDisabled}
          aria-label="清空日期区间"
          onClick={handleClear}
          className={cn(
            'mr-1 size-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground',
            size === 'sm' && 'size-6',
          )}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
