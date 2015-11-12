var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    plugins: [
        new ExtractTextPlugin('bundle.css', { allChunks: true })
    ],
    module: {
        loaders: [
            {   test: /\.js$/,
                loader: 'babel?optional=runtime'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
        ]
    }
};
