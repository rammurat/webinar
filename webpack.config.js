const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const swSrcPath = './src/sw.js';
const swDestPath = './dist/sw.js';

module.exports = {
    module: {
        rules: [{
            test: /\.html$/i,
            loader: "html-loader",
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
            use: [
                {
                  loader: 'file-loader',
                  options: {
                    outputPath: 'public',
                  },
                },
            ],
        }, ],
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
            title: 'PWA Demo',
            filename: 'index.html',
            template: './src/index.html'
        }),
        new WorkboxWebpackPlugin.InjectManifest({
            swSrc: path.resolve(__dirname, swSrcPath),
            swDest: path.resolve(__dirname, swDestPath),
            exclude: [/./],
            compileSrc: true,
            maximumFileSizeToCacheInBytes: 5242880,
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist'),
        clean: true,
        publicPath: '/',
    },
    optimization: {
        runtimeChunk: 'single',
    },
};