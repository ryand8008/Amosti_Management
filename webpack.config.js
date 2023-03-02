"use strict";

const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  // Set debugging source maps to be "inline" for
  // simplicity and ease of use
  devtool: "inline-source-map",

  // The application entry point
  entry: "./src/index.tsx",

  // Where to compile the bundle
  // By default the output directory is `dist`
  output: {
    // filename: "bundle.[chunkhash].js",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },

  // Supported file loaders
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        loader: "ts-loader"
      }
    ]
  },
  plugins: [
    new CompressionPlugin({
      filename: 'bundle.js.gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: false,
  },

  // File extensions to support resolving
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".gz"],
    fallback: {
    }
  },
};