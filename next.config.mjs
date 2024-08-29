/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverComponentsExternalPackages: ['@react-pdf/renderer'],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push('@react-pdf/renderer');
      }
      return config;
    },
  }
  
  module.exports = nextConfig