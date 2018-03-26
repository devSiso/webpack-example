const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development",
});

var path = require('path');

module.exports = {
    context: __dirname + "/app",
    entry: "./src/assets/js/index.js",
    output: {
        path: __dirname + "/app/dist",
        filename: "main.js"
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                            loader: "css-loader",
                            options: { minimize: true }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                ident: 'postcss',
                                plugins: (loader) => [
                                    require('autoprefixer') ()
                                ]
                            }
                        },
                        {
                            loader: "sass-loader"
                        }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(jpg|png|jpeg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        extractSass,
        new HtmlWebPackPlugin({
            template: "./src/public/index.html",
            filename: 'index.html'
        }),
        new BrowserSyncPlugin ({
            host:'localhost',
            port: 3000,
            server: { baseDir: ['app/dist'] }
        }),
        new CopyWebPackPlugin([
            {
                from: 'src/public/img',
                to:'img'
            }
        ])
    ],
};