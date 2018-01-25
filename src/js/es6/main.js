/* eslint-disable*/
/* eslint-env browser*/
// var $abc = require('jquery');
import $ from "jquery";

import captcha from "./captcha.js";
// var obv = require('./captcha.js').default;

// var Cap = require('./es5/all.js');

// dfds.toString();
var imgFg_src = './images/captcha_fg.png';
var imgBg_src = './images/captcha_1.jpg';

// console.log($('#captcha')[0]);
var Captcha = new captcha("captcha", 28, imgFg_src, imgBg_src);
window.winCaptcha = Captcha;
// console.log(Captcha);
window.winCaptcha.init();
// window.winCaptcha.drag();
// console.log(Captcha.img);

// function testc(el) {
// 	this.name = el;
// 	this.fn = function () {
// 		console.log(el);
// 	}
// }
// var Testc = new testc('test');
// Testc.fn();
// cbv.fn();
// alert('ok');