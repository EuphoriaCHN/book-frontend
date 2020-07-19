/**
 * Webpack 配置文件 _dll
 *
 * @author Wang Qinhong
 * @copyright XUST KCSoft
 */

const path = require('path');

// Bundle
const webpack = require('webpack');
const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// PATH
const OUTPUT_PATH = path.resolve(__dirname, '../', 'dist');

// HappyPack Plugins Constructor
function createHappyPlugin(id, loaders) {
  return new HappyPack({
    id,
    loaders,
    // threadPool: happyThreadPool,
  });
}

const config = {
  mode: 'production',
  entry: {
    react: ['react', 'react-dom', 'react-router-dom', 'react-router', 'prop-types'],
    // common: ['axios', 'classnames', "moment", 'core-js/es6/promise', 'core-js/es6/map', 'core-js/es6/set'],
    common: ['axios', 'classnames', 'moment', 'antd'],
  },
  output: {
    path: OUTPUT_PATH,
    filename: 'lib/[name]_[hash:8].dll.js',
    library: '[name]_[hash:8]',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true, // 多线程
        uglifyOptions: {
          compress: {
            drop_console: true, // 去除 console
            keep_infinity: true, // 去除影响性能的代码
          },
          output: {
            comments: false, // 去除注释
            beautify: false, // 紧凑输出
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\/\\]locale$/, /zh-cn|en-gb/),
    new webpack.DllPlugin({
      context: path.resolve(__dirname, '../'),
      path: path.join(__dirname, './[name]-manifest.json'),
      name: '[name]_[hash:8]',
    }),
    createHappyPlugin('happy-babel-js', [
      {
        loader: 'cache-loader',
        options: {
          cacheDirectory: path.resolve(__dirname, '.cache--happypack'),
        },
      },
      {
        loader: 'babel-loader',
        query: {},
      },
    ]),
  ],
};

module.exports = config;
