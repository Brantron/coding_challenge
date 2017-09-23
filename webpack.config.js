var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
module.exports = {
  context: __dirname,
  module: {
   loaders: [
     {
       test: /\.js$/,
       loader: "babel-loader",
       exclude: /node_modules/,
       query: {
         presets: ['env', 'es2015'],
         plugins: ['transform-class-properties']
       }
     }
   ]
 },
 resolve: {
   extensions: ['.js']
 }
}
