import type { NextConfig } from 'next'

const trimTrailingSlash = (value: string) => value.replace(/\/$/, '')

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
const apiProxyTarget = trimTrailingSlash(
    process.env.API_PROXY_TARGET || 'http://8.163.103.108',
)
const useProxy = baseUrl.startsWith('/')

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
    if (!useProxy) return []
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/:path*`,
      },
    ]
  },
}

export default config
