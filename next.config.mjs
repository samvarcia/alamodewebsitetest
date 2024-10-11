/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['cdn.shopify.com'],
    },
    webpack: (config) => {
      config.resolve.alias.canvas = false;
      return config;
    },
  }
  
  export default nextConfig;