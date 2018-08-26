require('babel-polyfill');
require('webpack');

const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', __dirname + '/src/server.js'],
    output: {
        path: __dirname + '/dist',
        filename: 'server.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
        ]
    },
    plugins: [
        new NodemonPlugin(),
    ],
    target: 'node',
    externals:[nodeExternals(), 'pg-hstore', 'tedious', 'mysql2'],
};