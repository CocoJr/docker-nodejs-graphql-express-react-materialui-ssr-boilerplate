require('babel-polyfill');
const webpack = require('webpack');

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
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.ENV),
            "process.env.APP_HOSTNAME": JSON.stringify(process.env.APP_HOSTNAME),
            "process.env.SERVER_PORT": JSON.stringify(process.env.SERVER_PORT),
        }),
    ],
    target: 'node',
    externals:[nodeExternals(), 'pg-hstore', 'tedious', 'mysql2'],
};