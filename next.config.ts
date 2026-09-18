import type { NextConfig } from 'next'

const trimTrailingSlash = (value: string) => value.replace(/\/$/, '')

const javaBaseUrl = process.env.NEXT_PUBLIC_JAVA_API_BASE_URL || '/api'
const agentBaseUrl = process.env.NEXT_PUBLIC_AGENT_API_BASE_URL || '/agent-api'
const javaProxyTarget = trimTrailingSlash(
  process.env.JAVA_API_PROXY_TARGET || 'http://8.163.103.108',
)
const agentProxyTarget = trimTrailingSlash(
  process.env.AGENT_API_PROXY_TARGET || 'http://192.168.7.34:8080',
)

const config: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  compress: true,
  images: {
    qualities: [50, 75, 90, 100],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async rewrites() {
    const rewrites = []

    if (javaBaseUrl.startsWith('/')) {
      rewrites.push({
        source: '/api/:path*',
        destination: `${javaProxyTarget}/:path*`,
      })
    }

    if (agentBaseUrl.startsWith('/')) {
      rewrites.push({
        source: '/agent-api/:path*',
        destination: `${agentProxyTarget}/:path*`,
      })
    }

    return rewrites
  },
}

export default config
