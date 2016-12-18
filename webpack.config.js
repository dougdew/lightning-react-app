var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve('dist'),
        filename: 'app.bundle.js',
        pathinfo: false
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?context=node_modules/@salesforce-ux/design-system&name=[path][name].[ext]'
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            inject: "body"
        })
    ]
};