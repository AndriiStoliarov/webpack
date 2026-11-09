const path = require('path');
// import path from 'path';
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                // hmr: isDev,
                // reloadAll: true
            },
        },
        'css-loader'
    ];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
}

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        //! This plugin is included in @babel/preset-env, in ES2022
        // plugins: [
        //     '@babel/plugin-transform-class-properties'
        // ]
    };

    if (preset) {
        opts.presets.push(preset);
    }

    return opts;
}

//! This loader has been deprecated. Please use eslint-webpack-plugin
// const jsLoaders = () => {
//     const loaders = [{
//         loader: 'babel-loader',
//         options: babelOptions()
//     }];

//     if (isDev) {
//         loaders.push('eslint-loader');
//     }

//     return  loaders;
// }

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            // title: 'Webpack Vladilen',
            template: './index.html',
            // minify: {
            //     collapseWhitespace: isProd
            // }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            // filename: '[name].[contenthash].js',
            filename: filename('css')
        }),
        new EslintWebpackPlugin(
            {
                extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx']
            }
        )
    ];

    if(isProd) {
        base.push(new BundleAnalyzerPlugin());
    }

    return base;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        //! @babel/polyfill has been deprecated
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        // filename: '[name].[contenthash].js',
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                // test: /\.(png|jpe?g|gif)$/i,
                use: ['file-loader']
            },
            // if you use this code you get a warning
            // {
            //     test: /\.(ttf|woff|woff2|eot)$/,
            //     use: ['file-loader']
            // },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            // {
            //     test: /\.m?js$/,
            //     exclude: /node_modules/,
            //     //! This loader has been deprecated. Please use eslint-webpack-plugin
            //     use: jsLoaders()
            // },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}