import { slideInDown, fadeIn, TweenLite, TimelineLite } from "../scripts/transitions.js";
require("../scripts/GSDevTools.min.js");

if (!env.prod) {
  window.GSDevTools.create();
}

var get = document.getElementById.bind(document);
var tl = new TimelineLite();

var btnCTA = get("buttonCTA") || get("btnCTA");
function animate() {
  TweenLite.defaultEase = Quad.easeOut;
  tl.add(fadeIn(get("bg"), 0, { id: "background" }));
  tl.add(slideInDown(get("logoHL"), .5, { id: "logo" }), .3);

  // CTA Button Functions
  btnCTA.addEventListener("mouseover", () => TweenLite.to(btnCTA, .25, { scale: 1.05 }));
  btnCTA.addEventListener("mouseout", () => TweenLite.to(btnCTA, .25, { scale: 1 }));
}

window.onload = animate;
