const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./src/i18n-config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic Next.js configuration for Sanity compatibility
  experimental: {
    // Disable turbo for studio route to fix HMR issues
    turbo: {
      rules: {
        '*/studio/**': false,
      },
    },
  },
  
  // Configure external images for Sanity CDN with optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
    // Enable modern formats for better compression
    formats: ['image/webp', 'image/avif'],
    // Minimize layout shift
    minimumCacheTTL: 31536000, // 1 year
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Transpile Sanity packages
  transpilePackages: ['@sanity/ui', '@sanity/icons'],
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Security Headers (additional layer to middleware)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          }
        ]
      }
    ];
  },
  
  // Webpack config for better Sanity compatibility and performance
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for Sanity Studio HMR issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = withNextIntl(withBundleAnalyzer(nextConfig));