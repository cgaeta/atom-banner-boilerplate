import "../scripts/script.js";
import "../scripts/EBLoader.js";
import "../styles/styles.scss";
import {TweenLite} from "gsap/TweenLite";

// import images from 'contents-loader?path=./images&match=\\.(png|jpe?g)$!';
require.context("./images", false, /\.(png|jpe?g)$/);

import "./animation.js";
