// 1. Update next.config.js with timeout and optimization settings
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['nidxounaaloryirlqhai.supabase.co'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    // Disable optimization for problematic images
    unoptimized: process.env.NODE_ENV === 'development', // Only for dev
    // Add loader configuration
    loader: 'default',
    // Increase timeout
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nidxounaaloryirlqhai.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Increase server timeout
  experimental: {
    proxyTimeout: 60000, // 60 seconds
    serverComponentsExternalPackages: ['sharp'],
  },
  // Add timeout for image optimization
  serverRuntimeConfig: {
    requestTimeout: 60000,
  },
}

module.exports = nextConfig

