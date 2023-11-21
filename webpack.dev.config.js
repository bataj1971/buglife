const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/index.ts',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: 'auto',
        clean:true,
    },
    mode: 'development',
    devServer: {        
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader', 'css-loader', 'sass-loader'
                ]
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },              
            
        ]
    },    
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },      
    plugins: [
        new HtmlWebpackPlugin({
            title: 'BugLife',
            description: 'buglife',
            template: 'src/page-template.hbs'
        })
    ]
};
