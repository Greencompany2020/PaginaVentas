require('dotenv').config()
const path = require('path');
const webpack = require('webpack')

module.exports = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  env: {
    API_CONFIGURADOR_URL: process.env.API_CONFIGURADOR_URL || 'http://localhost:5000',
    API_VENTAS_URL: process.env.API_VENTAS_URL || 'http://localhost:4000',
    API_DIGITALIZADO_URL: process.env.API_DIGITALIZADO_UR || ' http://localhost:5500'
  },
  images: {
    domains: ['localhost', 'api.officialstore.net']
  }
}
