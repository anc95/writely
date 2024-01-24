const { rules } = require('./webpack.rules')
const path = require('path')

exports.mainConfig = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/electron/main/index.ts',
  target: 'electron-main',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: [
      '.electron.tsx',
      '.electron.ts',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.json',
    ],
    alias: {
      '@': path.join(__dirname, '../src/'),
    },
    fallback: {},
  },
}
