/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/form'],
  },
}

export default nextConfig
