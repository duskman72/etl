const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ProgressPlugin = require('progress-webpack-plugin');
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin')

const buildServer = (_, argv) => {
    return {
        mode: argv.mode || "development",
        target: "node",
        entry: {
            server: "./src/backend/index.ts"
        },
        module: {
            rules: [
              {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/,
                include: [path.resolve(__dirname, 'src/backend'),]
              },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
        },
        node: {
            __dirname: false,
            __filename: false,
        },
        stats: 'errors-only',
        externals: [nodeExternals()],
        plugins: [
            new ProgressPlugin({
                identifier: "Backend"
            })
        ]
    }
}

const buildFrontend = (_, argv) => {
    const mode = argv.mode || "development";
    return {
        mode,
        devtool: mode === "development" ? "eval-cheap-module-source-map" : "nosources-source-map",
        target: "web",
        entry: {
            "app": "./src/frontend/index.tsx"
        },
        module: {
            rules: [
              {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: [/node_modules/, path.resolve(__dirname, 'src/backend'),],
                include: [path.resolve(__dirname, 'src/frontend'),]
              },
              { 
                test: /\.scss$/, 
                use: [ "style-loader", MiniCSSExtractPlugin.loader, "css-loader", "sass-loader" ],
                exclude: /node_modules/,
              },
              {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
              },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'public/assets'),
            publicPath: "/assets/",
            pathinfo: false,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "src/frontend/resources/html/index.html"),
                filename: path.resolve(__dirname, "dist/frontend.html"),
                inject: false
            }),
            new ProgressPlugin({
                identifier: "Frontend"
            }),
            new webpack.ProvidePlugin({
                React: "react",
                ReactDOM: "react-dom"
            }),
            new MiniCSSExtractPlugin({
                filename: 'css/[name].css',
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: "dev/[name][ext].map"
            })
        ],
        stats: 'errors-only',
        externals: [
            { 
                moment: "moment",
                jquery: "jQuery",
                react: "React",
                "react-dom": "ReactDOM",
                "react-router-dom": "ReactRouterDOM"
            }
        ],
        optimization: {
            mangleExports: mode == "production",
            minimize: mode == "production",
            minimizer: [
                mode == "production" ? new CssMinimizerPlugin() : () => {},
                mode == "production" ? new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true, // remove console statement
                        },
                    },
                }) : () => { },
            ],
        },
    }
}

const buildVendor = (_, argv) => {
    return {
        mode: argv.mode || "development",
        devtool: argv.mode === "development" ? "eval-cheap-module-source-map" : undefined,
        target: "web",
        entry: {
            "vendor": "./src/frontend/resources/vendor.js"
        },
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'public/assets'),
            publicPath: "/assets/",
            pathinfo: false,
        },
        plugins: [
            new ProgressPlugin({
                identifier: "Vendor"
            }),
        ],
        plugins: [
            new webpack.SourceMapDevToolPlugin({
                filename: "dev/[name][ext].map"
            })
        ],
        stats: 'errors-only',
    }
}

module.exports = [
    buildServer,
    buildVendor,
    buildFrontend
]