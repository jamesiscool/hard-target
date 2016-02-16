var path = require('path')
var webpack = require('webpack')

module.exports = {
   // devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './index'
    ],
    devtool: "eval",
    output: {
        path: path.join(__dirname, "public"),
        filename: "bundle.js"
    },
    target: 'node-webkit',
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.css?$/,
            loader: "style-loader!css-loader",
            exclude: /node_modules///,
            //include: __dirname
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    node: {
        fs: "empty"
    }
};