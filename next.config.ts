import type { NextConfig } from 'next'

// Industry-standard Next.js configuration for links, assets and security
const nextConfig: NextConfig = {
  // Enable strict mode if desired (helps catch React issues)
  reactStrictMode: true,

  // Allow network access from local devices during development (iPad, phone, etc.)
  allowedDevOrigins: ['192.168.1.194:3000'],

  // Optimize images served from known external hosts
  images: {
    remotePatterns: [
      // Common CDNs and external hosts you might use. Add your domains here.
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.imgix.net' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.cdn.jsdelivr.net' },
    ],
  },

  // Redirect to canonical host when CANONICAL_HOST env var is set
  async redirects() {
    const canonicalHost = process.env.CANONICAL_HOST
    if (!canonicalHost) return []

    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `!${canonicalHost}`,
          },
        ],
        destination: `https://${canonicalHost}/:path*`,
        permanent: true,
      },
    ]
  },

  // Security and performance headers (CSP and common headers)
  async headers() {
    // In development, allow localhost connections for local Supabase
    const isDevelopment = process.env.NODE_ENV === 'development'
    const connectSrc = isDevelopment
      ? "'self' https: http://127.0.0.1:* http://localhost:*"
      : "'self' https:"

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
          // A conservative Content-Security-Policy. Adjust as needed for analytics/CDNs.
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
              "style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; " +
              `font-src 'self' https: data:; connect-src ${connectSrc};`,
          },
        ],
      },
    ]
  },

  // Helpful build-time and runtime flags — keep conservative defaults
  experimental: {
    // Opt into stable features if needed. Leave empty or add flags here.
  },
}

export default nextConfig
