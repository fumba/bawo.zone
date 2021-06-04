/* eslint-disable no-var, strict, prefer-arrow-callback */
"use strict";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

var babelLoader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
    presets: ["@babel/preset-env"],
  },
};

module.exports = {
  entry: {
    app: "./src/js/app.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
    },
  },
  devServer: {
    contentBase: "./dist",
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [babelLoader, { loader: "ts-loader" }],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [babelLoader],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.mp3$/,
        exclude: /node_modules/,
        use: [{ loader: "file-loader" }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./app/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/data", to: "data" }],
    }),
  ],
};
