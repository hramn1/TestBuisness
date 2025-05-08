const path = require(`path`);

module.exports = {
    entry: `./src/index.ts`,
    output: {
        filename: `bundle.js`,
        path: path.resolve(__dirname, `dist`)
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        static: path.resolve(__dirname, `dist`),
        open: true,
        historyApiFallback: true,
        // inline: true,
        port: 3000,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
          "@": path.resolve(__dirname, 'src/'),
          "@components": path.resolve(__dirname, 'src/components/'),
        },
    },
};
