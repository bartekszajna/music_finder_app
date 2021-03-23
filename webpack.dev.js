const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {};

config.mode = 'development';

config.entry = { main: './src/scripts/index.js' };

config.output = {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),
};

config.devtool = 'cheap-module-eva-source-map';

config.devServer = {
  contentBase: './dist',
  inline: true,
  open: true,
  port: 8000,
};

config.module = {
  rules: [
    {
      test: /\.html$/,
      use: ['html-loader'],
    },
    {
      test: /\.(svg|png|jpg|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: './assets',
        },
      },
    },
    {
      test: /\.s(a|c)ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
  ],
};

config.plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  new CleanWebpackPlugin(),
];

module.exports = config;
