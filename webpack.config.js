const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',

    entry: ['./app/index.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: './dist/'
    },
    plugins: [],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'app'),
                exclude: /node_modules/,
                query: {
                    presets: ['env', 'react']
                }
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            }, {
                test: /\.(jpg|png|svg)$/,
                loader: 'file-loader',
                include: path.join(__dirname, 'app', 'assets')
            }
        ]
    }
};
