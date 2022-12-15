const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ProgressPlugin = require('progress-webpack-plugin');
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

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
    return {
        mode: argv.mode || "development",
        devtool: argv.mode === "development" ? "source-map" : undefined,
        target: "web",
        entry: {
            app: "./src/frontend/index.tsx"
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
                    filename: './fonts/[name][ext]',
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
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "src/frontend/resources/html/index.html"),
                filename: path.resolve(__dirname, "dist/frontend.html"),
                publicPath: "/assets",
                inject: "body",
                xhtml: true
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
        ],
        stats: 'errors-only',
        externals: [
            { 
                moment: "moment",
                jquery: "jQuery",
                react: "React",
                "react-dom": "ReactDOM"
            }
        ]
    }
}

const buildVendor = (_, argv) => {
    return {
        mode: argv.mode || "development",
        devtool: argv.mode === "development" ? "source-map" : undefined,
        target: "web",
        entry: {
            vendor: "./src/frontend/resources/vendor.js"
        },
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'public/assets'),
        },
        plugins: [
            new ProgressPlugin({
                identifier: "Vendor"
            }),
        ],
        stats: 'errors-only',
    }
}

module.exports = [
    buildServer,
    buildVendor,
    buildFrontend
]