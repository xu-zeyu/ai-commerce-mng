import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const AGENT_API_TARGET = trimTrailingSlash(
  process.env.AGENT_API_PROXY_TARGET ?? 'http://192.168.7.34:8080',
)

export async function POST(request: NextRequest) {
  const headers = new Headers({
    Accept: 'text/event-stream',
    'Content-Type': 'application/json',
  })
  const authorization = request.headers.get('authorization')
  const cookie = request.headers.get('cookie')
  if (authorization) headers.set('Authorization', authorization)
  if (cookie) headers.set('Cookie', cookie)

  try {
    const upstream = await fetch(`${AGENT_API_TARGET}/api/sse/baseWeChat/content/agent`, {
      method: 'POST',
      headers,
      body: await request.text(),
      cache: 'no-store',
      signal: request.signal,
    })

    const responseHeaders = new Headers({
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': upstream.headers.get('content-type') ?? 'text/event-stream; charset=utf-8',
      'X-Accel-Buffering': 'no',
    })

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    })
  } catch (error) {
    if (request.signal.aborted) {
      return new Response(null, { status: 499 })
    }

    const message = error instanceof Error ? error.message : '内容生成服务连接失败'
    return Response.json({ message }, { status: 502 })
  }
}
