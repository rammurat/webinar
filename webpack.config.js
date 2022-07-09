

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  mode: 'development',
   entry: {
     index: './src/index.js',
   },
   devServer: {
    static: './dist',
  },
  devtool: 'inline-source-map',
   plugins: [
     new HtmlWebpackPlugin({
      title: 'Output Management',
      title: 'Development',
     }),
   ],
   output: {
    filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
     publicPath: '/',
   },
   optimization: {
    runtimeChunk: 'single',
   },
 };