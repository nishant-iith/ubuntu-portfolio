/** @type {import('next').NextConfig} */
const repo = 'ubuntu-portfolio';

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  trailingSlash: true,

  // Image optimization
  images: {
    unoptimized: true,
    domains: [],
    formats: ['image/webp', 'image/avif'],
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