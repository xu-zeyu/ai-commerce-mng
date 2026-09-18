'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { openAgentStream } from '../api/open-agent-stream'
import type { AgentStreamEvent, AgentStreamStatus } from '../types'

const MAX_VISIBLE_EVENTS = 500

export function useAgentStream() {
  const [events, setEvents] = useState<AgentStreamEvent[]>([])
  const [status, setStatus] = useState<AgentStreamStatus>('connecting')
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const connectionRef = useRef(0)
  const eventIdRef = useRef(0)

  const disconnect = useCallback(() => {
    connectionRef.current += 1
    controllerRef.current?.abort()
    controllerRef.current = null
    setStatus('closed')
  }, [])

  const connect = useCallback(() => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    const connectionId = connectionRef.current + 1
    connectionRef.current = connectionId
    controllerRef.current = controller
    setStatus('connecting')
    setError(null)

    void (async () => {
      try {
        for await (const packet of openAgentStream(controller.signal)) {
          if (connectionRef.current !== connectionId) return
          setStatus('connected')
          eventIdRef.current += 1
          const event: AgentStreamEvent = {
            ...packet,
            id: eventIdRef.current,
            receivedAt: new Date().toISOString(),
          }
          setEvents((current) => [...current, event].slice(-MAX_VISIBLE_EVENTS))
        }
        if (connectionRef.current === connectionId) setStatus('closed')
      } catch (streamError) {
        if (controller.signal.aborted || connectionRef.current !== connectionId) return
        setError(streamError instanceof Error ? streamError.message : '未知连接错误')
        setStatus('error')
      }
    })()
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(connect, 0)
    return () => {
      window.clearTimeout(timeoutId)
      connectionRef.current += 1
      controllerRef.current?.abort()
    }
  }, [connect])

  return {
    clearEvents: () => setEvents([]),
    connect,
    disconnect,
    error,
    events,
    status,
  }
}
