const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');


const PUBLIC_URL = '';
const PUBLIC_PATH = '/';

module.exports = {
    devtool: 'eval',

    entry: [
        require.resolve('react-dev-utils/webpackHotDevClient'),
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
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader?sourceMap=inline'
                ]
            },

            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'postcss-loader?sourceMap=inline'
                ]
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
            template: path.resolve(__dirname, 'public', 'index.html')
        }),

        new webpack.HotModuleReplacementPlugin(),

        new webpack.DefinePlugin({
            __PRODUCTION__: false,
            __DEVELOPMENT__: true
        }),

        new webpack.EnvironmentPlugin(['NODE_ENV', 'APP_URL', 'MAPBOX_API_KEY']),

        new CaseSensitivePathsPlugin()
    ],

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
