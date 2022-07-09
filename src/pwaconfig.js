

require('shelljs/make');
const path = require('path');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const buildPWAConfig = function () {
    const configArr = [];
    let tempPWAConfig = {};
    const swSrcPath = './src/sw.js';
    const swDestPath = './dist/sw.js';
    const tempObj = {
        name: 'pwa',
        entry: path.resolve(__dirname, swSrcPath),
        plugins: [
            new WorkboxWebpackPlugin.InjectManifest({
                swSrc: path.resolve(__dirname, swSrcPath),
                swDest: path.resolve(__dirname, swDestPath),
                exclude: [/./],
                compileSrc: true,
                maximumFileSizeToCacheInBytes: 5242880,
            }),
        ],
    };
    tempPWAConfig = Object.assign({}, tempPWAConfig, tempObj);
    configArr.push(tempPWAConfig);

    return [].concat.apply([], configArr);
};

module.exports = buildPWAConfig;
