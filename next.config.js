/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost','secure.davidmc.io'],
  },
  experimental: {
    scrollRestoration: true,
  },
  trailingSlash: true,
  env: {
    WORDPRESS_HOST: process.env.WORDPRESS_HOST,
    FRONTEND_HOST: process.env.FRONTEND_HOST,
    IMGIX_HOST: process.env.IMGIX_HOST
  },
}

module.exports = nextConfig
