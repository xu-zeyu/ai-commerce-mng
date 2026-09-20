'use client'

import { useCallback, useRef } from 'react'

interface OriginPoint {
  x: number
  y: number
}

export function useDialogOrigin() {
  const originRef = useRef<OriginPoint | null>(null)

  /** 从鼠标事件捕获触发点位置；键盘触发时回退到元素中心。 */
  const captureOrigin = useCallback((event: React.MouseEvent | React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const isKeyboardTrigger = event.clientX === 0 && event.clientY === 0

    originRef.current = {
      x: isKeyboardTrigger ? rect.left + rect.width / 2 : event.clientX,
      y: isKeyboardTrigger ? rect.top + rect.height / 2 : event.clientY,
    }
  }, [])

  /** 从 DOM 元素捕获触发点位置（元素中心） */
  const captureFromElement = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    originRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }, [])

  /** 获取触发点坐标 */
  const getOriginPoint = useCallback(() => {
    return originRef.current
  }, [])

  return {
    originRef,
    captureOrigin,
    captureFromElement,
    getOriginPoint,
  }
}
