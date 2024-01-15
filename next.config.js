/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['secure.davidmc.io','*.cdninstagram.com'],
  },
  experimental: {
    scrollRestoration: true,
  },
  trailingSlash: true,
  env: {
    WORDPRESS_HOST: process.env.WORDPRESS_HOST,
    FRONTEND_HOST: process.env.FRONTEND_HOST,
    IMGIX_HOST: process.env.IMGIX_HOST,
    INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME
  },
  async rewrites() {
    return [
      {
        source: '/page/:page',
        destination: '/?page=:page',
      },
    ];
  },
}

module.exports = nextConfig
