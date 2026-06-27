import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@react-pdf/renderer'],
  typescript: {
    // Allow deployments to proceed even if type errors exist.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
