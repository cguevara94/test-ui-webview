const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.env.NODE_ENV === 'production' ? 'bundle.[hash].js' : 'bundle.js',
    publicPath: '/'
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
    new CleanWebpackPlugin(),
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
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    hot: true
  },
  // Optimizaciones para compatibilidad WebView
  optimization: {
    minimize: false
  },
  // Asegurar compatibilidad con WebView
  target: 'web',
  // Configuración adicional para compatibilidad
  node: {
    global: false
  }
};
