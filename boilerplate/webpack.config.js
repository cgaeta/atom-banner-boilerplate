const path = require('path');

const myPlugins = require("./webpackPackages/plugins.js").myPlugins;
const myModules = require("./webpackPackages/module.js");

function config(env, argv) {

  var dynEntry = {};
  dynEntry[`${env.width}x${env.height}`] = `./src/${env.width}x${env.height}${env.audience ? `/${env.audience}` : ``}/entry.js`;

  var dynOutput = `dist/${env.campaign ? `${env.campaign}_` : ``}${env.width}x${env.height}${env.prod ? `` : `_dev`}${env.audience ? `_${env.audience}` : ``}`;

  return {
    entry: dynEntry,
    module: myModules(env),
    plugins: myPlugins(env),
    externals: {
      'gsap/TweenLite': 'TweenLite',
      'gsap/TimelineLite': "TimelineLite"
    },
    output: {
      filename: 'scripts/animation.js',
      path: path.resolve(__dirname, dynOutput),
      library: "package",
      pathinfo: true
    }
  };
};

module.exports = config;
