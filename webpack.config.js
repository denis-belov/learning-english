const path = require('path');
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const host = child_process.execSync('ipconfig', { encoding: 'utf8' }).split('\r\n').slice(-4, -3)[0].split(':')[1].trim();

module.exports = {
  entry: './src/index.js',

  resolve: {
    extensions: [ '.js' ],
    modules: [ './node_modules' ],
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/',
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'build/index.html'),
      template: path.join(__dirname, 'src/index.html'),
      inject: false,
      minify: {
        removeAttributeQuotes: true,
      },
    }),
  ],

  devServer: {
    host: '0.0.0.0',
    port: 8088,
    compress: true,
    // watchOptions: {
    //   ignored: [
    //     path.join(__dirname, 'backend'),
    //   ]
    // }
  },
};
