/** @type {import('next').NextConfig} */
const webpack = require("webpack");

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore .node binary files
    config.module.rules.push({
      test: /\.node$/,
      loader: "ignore-loader",
    });

    // Completely ignore ort (onnxruntime) WASM bundles that use import.meta
    // This prevents them from being bundled during SSR
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /ort\.bundle\.min\.mjs$/,
      })
    );

    // Also ignore ort-wasm-proxy-worker
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /ort-wasm-proxy-worker/,
      })
    );

    return config;
  },
};

module.exports = nextConfig;
