require('dotenv').config()
const path = require('path');
const webpack = require('webpack')

module.exports = {
  reactStrictMode: true,
  // webpack: config => {
  //   config.resolve.modules.push(path.resolve('./'));
  //   config.plugins.push(
  //     new webpack.DefinePlugin({
  //       'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL)
  //     })
  //   )
  //   return config;
  // },
  experimental: {
    outputStandalone: true,
  },
  env: {
    API_CONFIGURADOR_URL: process.env.API_CONFIGURADOR_URL || 'http://localhost:5000',
    API_VENTAS_URL: process.env.API_VENTAS_URL || 'http://localhost:4000'
  },
  images: {
    domains: ['localhost', 'api.officialstore.net']
  }
}
