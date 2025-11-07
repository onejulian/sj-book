const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { HtmlRspackPlugin, CopyRspackPlugin } = require('@rspack/core');

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlRspackPlugin({
      template: './index.html',
      inject: 'body',
      minify: process.env.NODE_ENV === 'production'
    }),
    new CopyRspackPlugin({
      patterns: [
        { from: 'public', to: 'public' },
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'service-worker.js', to: 'service-worker.js' },
        { from: 'version.js', to: 'version.js' }
      ]
    })
  ],
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};

