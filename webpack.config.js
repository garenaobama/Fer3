const path = require('path');

module.exports = {
  entry: './src/index.js', // Update with your entry file path
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify")
    },
  },
  module: {
    rules: [
      // Add any necessary loaders for your project
      // For example, if you're using Babel:
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000, // Update with your desired port number
  },
};







