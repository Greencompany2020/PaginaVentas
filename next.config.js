const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: config => {
    config.resolve.modules.push(path.resolve('./'));
    return config;
  },
  experimental: {
    outputStandalone: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  },
  images: {
    domains: ['localhost', 'https://next.officialstore.net']
  }
}
