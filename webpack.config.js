const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  var config = {
    mode: 'production',
    entry: {
      main: './src/tools/script.js',   // loads d3 based script
      toolbox: './src/toolbox.js',  // loads react + reactflow script
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].bundle.js',
    },
    devServer: {
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '',
      },
      compress: true,
      port: 9000,
    },
    module: {
      rules: [
        // babel loader for React/JSX
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.csv/,
          type: 'asset/source',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator : {
            filename : 'images/[name][ext][query]',
          }
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(), 
      ],
    },
    plugins: [
      new BundleAnalyzerPlugin(),
    ]
  };
  if (argv.mode === 'development') {
    config.optimization.minimize = false;
    config.mode = 'development';
  }
  return config;
};