import { tweenFunction, TweenLite, TimelineLite } from "./transitions.js";

var fadeIn = tweenFunction(0, "from");

export function start (bg, logo) {
  return new TimelineLite({ id: "start" })
    .add(fadeIn(bg), 0)
    .add(fadeIn(logo), .3);
}

export function enterCTA (btn) {
  return fadeIn(btn);
}

export function ctaHover (btn) {
  btn.addEventListener("mouseover", () => TweenLite.to(btn, .25, { scale: 1.05 }));
  btn.addEventListener("mouseout", () => TweenLite.to(btn, .25, { scale: 1.05 }));
}
