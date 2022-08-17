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
    API_CONFIGURADOR_URL: process.env.API_CONFIGURADOR_URL || 'http://localhost:4000',
    API_VENTAS_URL: process.env.API_VENTAS_URL || 'http://localhost:4000'
  },
  images: {
    domains: ['localhost', 'next.officialstore.net']
  }
}
