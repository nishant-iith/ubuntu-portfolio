/** @type {import('next').NextConfig} */
const repo = 'ubuntu-portfolio';

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double-rendering in development
  swcMinify: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  trailingSlash: true,

  // Image optimization
  // Enable optimization for development and production (Vercel/serverful)
  // Disable only for GitHub Pages static export
  images: {
    unoptimized: isProd && isGitHubPages, // Only unoptimized for GitHub Pages
    domains: ['raw.githubusercontent.com', 'avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },

  // GitHub Pages specific settings only when deploying to GitHub Pages
  ...(isProd && isGitHubPages && {
    output: 'export',
    distDir: 'docs',
    basePath: '/' + repo,
    assetPrefix: '/' + repo + '/',
  }),
}

module.exports = nextConfig