const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require('../../package.json');

const libraryName = pkg.name;

module.exports = (env) => {
  console.info('webpacking for transpile');
  return {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
      path: path.resolve(process.cwd(), 'es'),
      filename: 'index.js',
      library: libraryName,
      libraryTarget: 'umd',
      publicPath: '/es/',
      umdNamedDefine: true
    },
    plugins: [
      new webpack.BannerPlugin(`react-ciscospark v${pkg.version}`),
      new ExtractTextPlugin({
        filename: '[name].css'
      })
    ],
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      dns: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.woff$/,
          // Inline small woff files and output them below font/.
          // Set mimetype just in case.
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              mimetype: 'application/font-woff'
            }
          }]
        },
        {
          test: /\.woff2$/,
          // Inline small woff files and output them below font/.
          // Set mimetype just in case.
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              mimetype: 'application/font-woff2'
            }
          }]
        },
        {
          test: /\.ttf$|\.otf$|\.eot$|\.svg$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }]
        },
        {
          test: /\.mp3$|\.wav$/,
          use: [{
            loader: 'file-loader',
            query: {
              name: 'media/[name].[ext]'
            }
          }]
        },
        {
          test: /.*\.(gif|png|jpg)$/,
          use: [
            'file-loader?name=[name].[ext]'
          ]
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
            path.resolve(__dirname, '..', '..', 'src')
          ],
          use: ExtractTextPlugin.extract({
            use: [{
              loader: 'css-loader',
              options: {
                camelCase: true,
                modules: true,
                localIdentName: `${env && env.package ? env.package : 'widget'}--[local]--[hash:base64:5]`,
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                path: path.resolve(__dirname, 'postcss.config.js')
              }
            }]
          })
        },
        {
          // Do not transform vendor`s CSS with CSS-modules
          test: /\.css$/,
          include: [path.resolve(__dirname, '..', '..', 'node_modules')],
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          include: [
            path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
            path.resolve(__dirname, '..', '..', 'src'),
            path.resolve(__dirname, '..', '..', 'node_modules')

          ],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }]
          })
        },
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
            path.resolve(__dirname, '..', '..', 'src'),
            path.resolve(__dirname, '..', '..', 'samples')
          ],
          exclude: [
            '/__fixtures__/',
            '/__mocks__/'
          ],
          use: ['babel-loader']
        }
      ]
    },
    resolve: {
      alias: {
        assets: path.resolve(__dirname, 'assets'),
        node_modules: path.resolve(__dirname, '..', '..', 'node_modules')
      },
      mainFields: ['src', 'browser', 'module', 'main'],
      modules: [
        'src',
        path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
        'node_modules'
      ],
      extensions: ['.js', '.css', '.json', '.scss']
    },
    externals: {
      // Don't bundle react or react-dom
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM'
      }
    }
  };
};
