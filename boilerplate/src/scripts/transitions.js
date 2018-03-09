import TweenLite from "gsap/TweenLite";
import TimelineLite from "gsap/TimelineLite";

function tweenFunction (opacity, x, y, el, start, opt) {
  return function (el, dur, opt) {
    return TweenLite.to(el, dur || .5, {
      opacity: opacity,
      left: x || "+=0",
      top: y || "+=0",
      delay: opt.delay || 0,
      id: opt.id || ""
    });
  }
}

var slideInLeft = tweenFunction(1, "-=50");
var slideOutLeft = tweenFunction(0, "-=50");
var slideInRight = tweenFunction(1, "+=50");
var slideOutRight = tweenFunction(0, "+=50");
var slideInUp = tweenFunction(1, "+=0", "-=50");
var slideOutUp = tweenFunction(0, "+=0", "-=50");
var slideInDown = tweenFunction(1, "+=0", "+=50");
var slideOuDown = tweenFunction(0, "+=0", "+=50");
var fadeIn = tweenFunction(1);
var fadeOut = tweenFunction(0);

export {
  TweenLite,
  TimelineLite,
  slideInLeft,
  slideOutLeft,
  slideInRight,
  slideOutRight,
  slideInUp,
  slideOutUp,
  slideInDown,
  slideOutDown,
  fadeIn,
  fadeOut
};
