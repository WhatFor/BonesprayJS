var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/ts/app.ts',
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
        extensions: ['.ts']
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};