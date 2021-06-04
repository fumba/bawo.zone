const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const envName = (env) => {
  if (env.production) {
    return "production";
  }
  if (env.test) {
    return "test";
  }
  return "development";
};

const envToMode = (env) => {
  if (env.production) {
    return "production";
  }
  return "development";
};

var babelLoader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
    presets: ["@babel/preset-env"],
  },
};

module.exports = (env) => {
  return {
    target: "electron-renderer",
    mode: envToMode(env),
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${envName(env)}.json`),
      },
      extensions: [".ts", ".tsx", ".js"],
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
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
          test: /\.mp3$/,
          exclude: /node_modules/,
          use: [{ loader: "file-loader" }],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: "src/data", to: "data" }],
      }),
    ],
  };
};
