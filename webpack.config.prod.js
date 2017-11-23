const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PUBLIC_URL = '';
const PUBLIC_PATH = '/';

module.exports = {
    bail: true,

    devtool: 'source-map',

    entry: [
        require.resolve('whatwg-fetch'),
        path.resolve(__dirname, 'src', 'index.js')
    ],

    output: {
        path: path.resolve(__dirname, 'build'),
        pathinfo: true,
        filename: '[hash].js',
        publicPath: PUBLIC_PATH
    },

    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.json'
        ],
        modules: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')
        ],
        alias: {
            config: path.resolve(__dirname, 'config')
        }
    },

    module: {
        noParse: [
            /react\.min\.js/
        ],
        rules: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.json$/,
                    /\.svg$/
                ],
                use: [
                    'url-loader?limit=1000&name=static/media/[name].[hash:8].[ext]'
                ]
            },

            {
                test: /\.js(|x)$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'config')
                ],
                use: [
                    'babel-loader?cacheDirectory=true'
                ]
            },

            {
                test: /\.css$/,
                include: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {
                            loader: 'css-loader',
                            query: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                })
            },

            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader:
                        'css-loader' +
                            '?modules' +
                            '&minimize=true' +
                            '&importLoaders=1' +
                            '&localIdentName=[name]__[local]___[hash:base64:5]' +
                        '!postcss-loader'
                })
            },

            {
                test: /\.json$/,
                use: [
                    'json-loader'
                ]
            },

            {
                test: /\.svg$/,
                use: [
                    'file-loader?name=static/media/[name].[hash:8].[ext]'
                ]
            }
        ]
    },

    plugins: [
        new InterpolateHtmlPlugin({
            PUBLIC_URL
        }),

        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, 'public', 'index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),

        new webpack.optimize.DedupePlugin(),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true, // React doesn't support IE8
                warnings: false
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),

        new webpack.DefinePlugin({
            __PRODUCTION__: true,
            __DEVELOPMENT__: false
        }),

        new webpack.EnvironmentPlugin(['NODE_ENV', 'APP_URL', 'MAPBOX_API_KEY']),

        new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
    ],

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
