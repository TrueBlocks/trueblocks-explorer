const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const tsconfigLocation = path.resolve(__dirname, './tsconfig_ui.json');
const getSourceLocation = (...subdirectories) => ['./src/ui', ...subdirectories].join('/');

module.exports = () => ({
  entry: getSourceLocation('index.tsx'),
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/ui'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: { path: require.resolve('path-browserify') },
    alias: {
      '@components': path.resolve(__dirname, 'src/ui/components/'),
      '@hooks': path.resolve(__dirname, 'src/ui/hooks'),
      '@modules': path.resolve(__dirname, 'src/ui/modules'),
      '@sdk': path.resolve(__dirname, 'src/sdk/generated_ts'),
    },
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/, /\.test\./],
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
          configFile: tsconfigLocation,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new Dotenv({ safe: true }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: tsconfigLocation,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: getSourceLocation('index.html'),
    }),
  ],
  devtool: 'source-map',
});
