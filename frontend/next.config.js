/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13.4+
  images: {
    domains: ['localhost', 'example.com'], // Add your image domains here
  },
};

module.exports = nextConfig;