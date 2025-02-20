/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.shopify.com',
      '5b4ey7iavy.ufs.sh',
      'h8b8ligav2.ufs.sh'  // Add the new domain here
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
}

export default nextConfig;