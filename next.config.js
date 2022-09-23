require('dotenv').config()
const path = require('path');
const webpack = require('webpack')

module.exports = {
  future:{
    webpack5: true
  },
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  env: {
    API_CONFIGURADOR_URL: process.env.API_CONFIGURADOR_URL || 'http://localhost:5000',
    API_VENTAS_URL: process.env.API_VENTAS_URL || 'http://localhost:4000',
    API_DIGITALIZADO_URL: process.env.API_DIGITALIZADO_URL || ' http://localhost:5500'
  },
  images: {
    domains: ['localhost', 'api.officialstore.net']
  },

  webpack: (config) => {
    // load worker files as a urls with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker"
          }
        }
      ]
    });

    return config;
  }
}
