/** @type {import('next').NextConfig} */
const repo = 'ubuntu-portfolio';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  output: 'export',
  // If deploying to https://username.github.io/repo-name/
  basePath: isProd ? '/' + repo : '',
  assetPrefix: isProd ? '/' + repo + '/' : '',
}

module.exports = nextConfig