const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const  webpack  = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, './src/wordle.UI.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean : true,
    assetModuleFilename: '[name][ext]',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/': {
        target: 'http://agilec.cs.uh.edu',
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'http://agilec.cs.uh.edu',
          replace: 'http://localhost:3000',
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Wordle',
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.html'),
    })
  ]
};
          