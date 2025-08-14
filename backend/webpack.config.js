const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: {
    handler: './src/handler.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: [
    'aws-sdk',
    'express',
    'cors',
    'helmet',
    'joi',
    'uuid',
    'express-rate-limit',
  ],
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  stats: {
    errorDetails: true,
  },
};
