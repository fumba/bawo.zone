/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: [
      '@babel/preset-env'
    ]
  }
};

module.exports = {
  entry: './src/js/main.ts',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      exclude: /node_modules/,
      use: [
        babelLoader,
        { loader: "ts-loader" }
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        babelLoader
      ]
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        "style-loader",
        "css-loader"
      ]
    },
    {
      test: /\.mp3$/,
      exclude: /node_modules/,
      use: [
        { loader: "file-loader"}
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};