const extractCSS = require("./plugins.js").extractCSS;

function myModules (env) {

  return {
    rules: [
      {
        test: /\.s?css$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: env.prod,
                sourceMap: !env.prod
              }
            },
            {
              loader: 'sass-loader',
              options: {
                data: `
                $width: ${env.width}px;
                $height: ${env.height}px;
                `,
                sourceMap: !env.prod,
                includePaths: [
                  `./src/${env.width}x${env.height}`, // include banner-specific styles [size/target/exports.scss]
                  `./src/${env.width}x${env.height}${typeof env.audience === "undefined" ? `` : `/${env.audience}`}` // include size-specific styles [size/commons.scss]
                ]
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpe?g)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/'
          }
        }
      },
      {
        test: /(script|EBLoader|GSDevTools\.min)\.js$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'scripts/'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|script\.js|EBLoader|GSDevTools\.min)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
            plugins: [require('babel-plugin-transform-es2015-arrow-functions')]
          }
        }
      }
    ]
  }
}

module.exports =  myModules;
