import "../../scripts/script.js";
import "../../scripts/EBLoader.js";
import "../../styles/styles.scss";
import {TweenLite} from "gsap/TweenLite";

// import images from 'contents-loader?path=./images&match=\\.(png|jpe?g)$!';
let images = require.context("./images", false, /\.(png|jpe?g)$/);
// import cmnImages from 'contents-loader?path=../images&match=\\.(png|jpe?g)$!';
let cmnImages = require.context("../images", false, /\.(png|jpe?g)$/);

import "./animation.js";
