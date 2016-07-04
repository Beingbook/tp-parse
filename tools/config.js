import webpack from 'webpack';
import { merge } from 'lodash';
import { resolve } from 'path';
import fs from 'fs';
import { argv } from 'yargs';

export const DEBUG = !process.argv.includes('--release');
export const VERBOSE = process.argv.includes('--verbose');
export const WATCH = process.argv.includes('--watch');

export const DEV_PORT = argv.port || 8111;

export const ROOT = resolve(__dirname, '../');
export const buildPath = `${ROOT}/build`;
export const buildStaticPath = `${buildPath}/public`;
export const srcPath = `${ROOT}/src`;
export const modulePath = `${ROOT}/node_modules`;
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? 'development' : 'production',
  DEV: DEBUG,
  PORT: DEV_PORT,
};
export const stats = {
  colors: true,
  reasons: DEBUG,
  hash: VERBOSE,
  version: VERBOSE,
  timings: true,
  chunks: VERBOSE,
  chunkModules: VERBOSE,
  cached: VERBOSE,
  cachedAssets: VERBOSE,
};

export const webpackCommon = {
  output: {
    publicPath: '/',
    sourcePrefix: ' ',
  },
  cache: DEBUG,
  debug: DEBUG,
  stats,
  resolve: {
    root: srcPath,
    extensions: ['', '.json', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-2'],
          plugins: ['transform-flow-strip-types'],
        },
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },
};

export const webpackCommonPlugins = [
  new webpack.DefinePlugin(GLOBALS),
  new webpack.optimize.OccurenceOrderPlugin(),
  ...(DEBUG ? [
    // development
  ] : [
    // productions
  ]),
];

export const webpackServer = merge({}, webpackCommon, {
  entry: {
    server: [
      'babel-polyfill',
      `${srcPath}/server.js`,
    ],
    cloud: [
      'babel-polyfill',
      `${srcPath}/cloud.js`,
    ],
  },
  output: {
    path: buildPath,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  externals: [
    fs.readdirSync(modulePath).filter(x => x !== '.bin'),
  ],
  plugins: [
    ...webpackCommonPlugins,
    new webpack.BannerPlugin(
      'require(\'source-map-support\').install();',
      { raw: true, entryOnly: false }
    ),
  ],
});
