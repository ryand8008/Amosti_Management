"use strict";

const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

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
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
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
  plugins: [new CompressionPlugin()],

  // File extensions to support resolving
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".gz"],
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "url": false,
      "util": false,
      "querystring": false,
      "os": false,
      "async_hooks": require.resolve("async_hooks")
      // "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
    }
  },
};