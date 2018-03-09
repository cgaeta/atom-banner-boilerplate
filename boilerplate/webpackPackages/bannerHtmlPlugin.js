const fs = require('fs');

function TestPlugin(options) {
  this.prod = options.prod;
  this.name = options.name;
  this.minify = options.minify;
}

TestPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    var html = "";

    for (var filename in compilation.assets) {
      if (/\.(png|jpe?g)/.test(filename)) {
        var id = /images\/(.+?)\.\w+/.exec(filename)[1];
        html += `<img id="${id}" src="${filename}" alt="" />\n`;
      }
    }

    html = `<!doctype html>
<html>

<head>
  <title>2017_HL_BP_${this.name}_Awareness</title>

  <!--SIZMEK-->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!--CSS-->
  <link rel="stylesheet" href="styles/style.css" />
  <!--Consistency between browsers -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css" />

   <!--Load GSAP animation JavaScript libraries-->
  <script src="https://secure-ds.serving-sys.com/BurstingcachedScripts/libraries/greensock/1_19_0/TweenLite.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/TimelineLite.min.js"></script>
  <script src="https://secure-ds.serving-sys.com/BurstingcachedScripts/libraries/greensock/1_19_0/plugins/cssplugin.min.js"></script>
  <script src="https://secure-ds.serving-sys.com/BurstingcachedScripts/libraries/greensock/1_19_0/easing/easepack.min.js"></script>
  ${ this.prod ? '' : `<script src="scripts/GSDevTools.min.js"></script>` }

  <!--SCRIPTS-->
  <!--SizMek API-->
  <script src="scripts/EBLoader.js"></script>

  <!--Sizmek Scripts-->
  <script src="scripts/script.js"></script>

  <!--JQuery-->
  <script src="https://secure-ds.serving-sys.com/BurstingcachedScripts/libraries/jquery/1_42_0/jquery.js" type="text/javascript"></script>
</head>

<body>
  <div id="ad">
    <div id="banner">
    <a id="clickthrough-button" class="clickthrough" href="#">
      <!--CUSTOM-->
      ${html}
      <!--END CUSTOM-->
    </a>
    </div><!--banner-->
  </div><!--ad-->

  <!--Animation Scripts - must be at end for Greensock to work-->
  <script src="scripts/animation.js"></script>
</body>
</html>`;

    if (this.minify) {
      html = html.replace(/\n/g, '');
      html = html.replace(/<!--.+?-->/g, '');
    }

    function checkDirSync (dir) {
      try {
        return fs.statSync(dir).isDirectory();
      } catch (e) {
        if (e.code === 'ENOENT') {
          return false;
        } else {
          throw e;
        }
      }
    }

    var buildDir = this.name;

    if (!checkDirSync('dist')) {
      fs.mkdirSync('dist');
    }
    if (!checkDirSync('dist/'+this.name)) {
      fs.mkdirSync('dist/'+this.name);
    }
    fs.writeFile('./dist/'+this.name+'/index.html', html, function(err) {
      if(err) {
        return console.log(err);
      }
    });

    callback();
  }.bind(this));
};

module.exports = TestPlugin;
