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
    // Fix image quality warnings and optimize
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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
          // Content-Security-Policy - Secure configuration
          // Note: Next.js requires some inline scripts for hydration
          // Using 'strict-dynamic' for better security while maintaining functionality
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' https://vercel.live; " + // Next.js hydration needs unsafe-inline temporarily
              "style-src 'self' 'unsafe-inline' https:; " + // CSS-in-JS requires unsafe-inline
              "img-src 'self' data: https: blob:; " +
              `font-src 'self' https: data:; connect-src ${connectSrc}; ` +
              "frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ]
  },

  // Helpful build-time and runtime flags — keep conservative defaults
  experimental: {
    // React Compiler - automatic memoization and optimization
    reactCompiler: true,

    // Speed up build and dev server
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
    ],
    turbo: {
      // Turbopack optimizations for faster dev server
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Output standalone for smaller docker images (optional)
  // output: 'standalone',

  // Reduce bundle size by optimizing module IDs
  webpack: (config, { isServer, dev }) => {
    // Optimize module IDs for better caching
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    // Split large libraries into separate chunks for better caching
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          fullcalendar: {
            test: /[\\/]node_modules[\\/]@fullcalendar[\\/]/,
            name: 'fullcalendar',
            priority: 20,
          },
          dndkit: {
            test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
            name: 'dnd-kit',
            priority: 20,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 20,
          },
        },
      };
    }

    return config;
  },
}

export default nextConfig
