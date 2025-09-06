/** @type {import('next').NextConfig} */
const repo = 'ubuntu-portfolio';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  trailingSlash: true, // Better for GitHub Pages

  // Image optimization for static export
  images: {
    unoptimized: true, // Required for static export
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },

  // GitHub Pages compatible settings
  ...(isProd && {
    output: 'export',
    distDir: 'docs',
    basePath: '/' + repo,
    assetPrefix: '/' + repo + '/',
  }),
}

module.exports = nextConfig