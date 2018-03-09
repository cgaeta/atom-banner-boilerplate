import { tweenFunction, TweenLite, TimelineLite } from "../../scripts/transitions.js";

if (!env.prod) {
  require("../../scripts/GSDevTools.min.js");
  window.GSDevTools.create();
}

var fadeIn = tweenFunction(0, "from");
var slideInLeft = tweenFunction(0, "from", "+=50");
var slideOutLeft = tweenFunction(0, "to", "-=50");
var slideInUp = tweenFunction(0, "from", "+=0", "+=50");
var slideOutUp = tweenFunction(0, "to", "+=0", "-=50");
var slideOutDown = tweenFunction(0, "to", "+=0", "+=50");

var get = document.getElementById.bind(document);
var tl = new TimelineLite();

var txtHeadline1 = get("txtHeadline1"),
    txtHeadline2 = get("txtHeadline2"),
    txtHeadline3 = get("txtHeadline3"),
    imgTicket1 = get("imgTicket1"),
    imgTicket5 = get("imgTicket5"),
    btnCTA = get("buttonCTA") || get("btnCTA");

function animate() {
  TweenLite.defaultEase = Quad.easeOut;
  tl.add(fadeIn(get("bg"), 0, { id: "start" }))
    .add(fadeIn(get("logoHL")), .3);

  tl.add("frame1", .5)
    .add(slideInUp(txtHeadline1, .5, { id: "frame1" }), "frame1")
    .add(slideInUp(imgTicket1), "frame1+=.5")
    .add(slideInUp(imgTicket5), "frame1+=.75")
    .add(fadeIn(get("txtLegal")), "frame1+=1");

  tl.add("frame2", "frame1+=2.75")
    .add(slideOutUp(txtHeadline1), "frame2")
    .add(slideInUp(txtHeadline2, .5, { id: "frame2" }), "frame2+=.25");

  tl.add("frame3", "frame2+=2.75")
    .add(slideOutUp(txtHeadline2), "frame3")
    .add(slideInUp(txtHeadline3), "frame3+=.25")
    .add(fadeIn(btnCTA), "frame3+=.75");

  // CTA Button Functions
  btnCTA.addEventListener("mouseover", () => TweenLite.to(btnCTA, .25, { scale: 1.05 }));
  btnCTA.addEventListener("mouseout", () => TweenLite.to(btnCTA, .25, { scale: 1 }));
}

window.onload = animate;
