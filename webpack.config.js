var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, './'),
    entry: './src/ts/app.ts',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        index: 'index.html',
        liveReload: true,
        compress: true,
        port: 8080
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/, use: [
                    'babel-loader',
                    'ts-loader'
                ]
            },
            {
                test: /\.html$/, use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.html', '.scss']
    },
    plugins: [
        new htmlWebpackPlugin()
    ],
    stats: {
        colors: true
    },
};