//const CleanWebpackPlugin = require('clean-webpack-plugin');
const TestPlugin = require('./bannerHtmlPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const extractCSS = new ExtractTextPlugin("styles/style.css");

function myPlugins (env) {

  var dirname = `${env.campaign ? `${env.campaign}_` : ``}${env.width}x${env.height}${env.prod ? `` : `_dev`}${env.audience ? `_${env.audience}` : ``}`;

  var p = [
    //new CleanWebpackPlugin(['dist'], {}),
    new TestPlugin({
      prod: env.prod,
      name: dirname,
      minify: env.prod
    }),
    extractCSS,
    new webpack.DefinePlugin({
      "env.prod": typeof env.prod !== "undefined" ? true : false,
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ];

  if (env.prod) {
    p.push(new webpack.IgnorePlugin(/GSDevTools/));
    p.push(new UglifyJsPlugin({
      test: /\.js/,
      exclude: /node_modules/,
      uglifyOptions: {
        compress: true,
        ecma: 6
      }
    }));
  } else {
    p.push(new webpack.ProvidePlugin({
      "GSDevTools": "./GSDevTools.min.js"
    }));
  }

  return p;

}

module.exports = {
  myPlugins,
  extractCSS
};
