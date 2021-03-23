const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');

let config = {};

config.mode = 'production';

config.entry = { main: './src/scripts/index.js' };

config.output = {
  filename: '[name].[contenthash].js',
  path: path.resolve(__dirname, 'dist'),
};

config.devtool = 'cheap-source-map';

config.performance = {
  hints: 'error',
};

config.optimization = {
  minimizer: [
    new OptimizeCssAssetsPlugin(),
    new TerserPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
};

config.module = {
  rules: [
    {
      test: /\.s(a|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer()],
          },
        },
        'sass-loader',
      ],
    },
    {
      test: /\.js$/,
      include: path.resolve(__dirname, 'src/scripts'),
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
              },
            ],
          ],
        },
      },
    },
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
  ],
};

config.plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[contentHash].css',
  }),
];

module.exports = config;
