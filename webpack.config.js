const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
    environment: {
      arrowFunction: false,
      const: false,
      destructuring: false,
      forOf: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(react|react-dom|react-router|react-router-dom|@remix-run)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            cacheCompression: false
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      minify: process.env.NODE_ENV === 'production' ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: false,
        minifyCSS: true,
        minifyURLs: true
      } : false
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3000,
    historyApiFallback: true,
    hot: true
  },
  // Optimizaciones para compatibilidad WebView
  optimization: {
    minimize: false,
    usedExports: false,
    sideEffects: false,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  },
  // Asegurar compatibilidad con WebView - deshabilitar características modernas
  target: 'web',
  // Deshabilitar características modernas de webpack que pueden causar problemas
  experiments: {
    topLevelAwait: false
  }
};

