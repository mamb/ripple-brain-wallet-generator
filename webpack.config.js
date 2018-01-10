const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const PATHS = {
  app: path.join(__dirname, 'app/app.js'),
  dist: path.join(__dirname, 'docs') // github pages likes docs
};

const isProduction = process.env.NODE_ENV === 'production';
// const filename = isProduction ? '[name].[hash:8]' : '[name]';
const filename = '[name]';

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new HtmlWebpackPlugin({
    template: './app/index.html',
    inject: true,
    interpolate: true
  }),
];

if (isProduction) {
  plugins.push(new webpack.optimize.OccurrenceOrderPlugin);
  plugins.push(new UglifyJsPlugin());
}

module.exports = {
  devtool: 'source-map',
  entry: {
    app: PATHS.app
  },
  plugins: plugins,
  output: {
    path: PATHS.dist,
    filename: `${filename}.js`,
  },
  devServer: {
    compress: true,
    stats: 'minimal',
  },
  module: {
    rules: [
      { test: /\.html$/, use: { loader: 'html-loader', options: { interpolate: true } } },
      { test: /\.css$/, use: { loader: 'raw-loader' } }
    ]
  }
};
