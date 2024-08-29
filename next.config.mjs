/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['chrome-aws-lambda'],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push('chrome-aws-lambda');
      }
      return config;
    },
  }
  
  module.exports = nextConfig