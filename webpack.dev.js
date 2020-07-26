const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge.merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    watch: true,
    watchOptions: {
        ignored: ['node_modules']
    },
    stats: {
        // warnings: false,
        warningsFilter: [
            /\.d\.ts/,
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    }
});