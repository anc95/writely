const { rules } = require('./webpack.rules')
const { plugins } = require('./webpack.plugins')
const path = require('path')

exports.rendererConfig = {
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  plugins,
  resolve: {
    extensions: [
      '.electron.tsx',
      '.electron.ts',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
    ],
    alias: {
      '@': path.join(__dirname, '../src/'),
    },
  },
}
