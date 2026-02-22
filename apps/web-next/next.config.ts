import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    localPatterns: [
      { pathname: '/api/download' },
      { pathname: '/**' }
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'commondatastorage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'example.com', pathname: '/**' },
      { protocol: 'http', hostname: 'example.com', pathname: '/**' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
      { protocol: 'http', hostname: '*.aliyuncs.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.aliyuncs.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' }
    ]
  },
}

export default nextConfig
