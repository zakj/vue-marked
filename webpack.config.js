const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const base = {
  entry: {
    'vue-md': './src',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
      },
    ],
  },
};

const lib = merge(base, {
  output: {
    filename: 'vue-md.common.js',
    library: 'VueMd',
    libraryTarget: 'umd',
  },
  externals: /^[^.]/,
  target: 'node',
});

module.exports = [base, lib];
