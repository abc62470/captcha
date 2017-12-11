'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable*/
/* eslint-env browser*/
// import $ from "jquery";

var captcha = function () {
	function captcha(el, y, fg, bg) {
		_classCallCheck(this, captcha);

		this.isActive = false;
		this.isMove = false;
		this.id = el;
		this.el = $('#' + this.id);
		this.x = 0;
		this.y = y;
		// this.y = 28;
		// this.imgFg_src = '/images/captcha_fg.png';
		// this.imgBg_src = '/images/captcha_1.jpg';
		this.imgFg_src = fg;
		this.imgBg_src = bg;
		this.imgFgBox_src = '/images/box.png';
		this.imgFgShadow_src = '/images/captcha_fg_shadow.png';

		this.imgFgPic_el = document.createElement('img');
		this.imgFgBox_el = document.createElement('img');
		this.imgFgShadow_el = document.createElement('img');
		this.canvas = $('<canvas><img src="' + this.imgFg_src + '" /></canvas>');
		this.back_x = 205;

		this.imgHTML = '<div class="captcha-img">\n\t\t\t\t\t    <img class="captcha-img-bg" src="' + this.imgBg_src + '" alt="img">\n\t\t\t\t\t    <div class="captcha-img-fg"></div>\n\t\t\t\t\t</div>';
		this.btnHTML = '<div class="captcha-btn"> > </div>';
		this.noneHTML = '<div class="captcha-hide"></div>';
	}

	_createClass(captcha, [{
		key: 'init',
		value: function init() {
			this.el.append(this.imgHTML + this.btnHTML + this.noneHTML);
			this.el.find(".captcha-img .captcha-img-fg").append(this.canvas);
			console.log($(this.el).find(".captcha-img-fg"));
			this.imgFg = $(this.el).find(".captcha-img-fg").css('top', this.y);
			this.imgBg = $(this.el).find(".captcha-img-bg");
			this.btn = $(this.el).find(".captcha-btn");
			this.hideDiv = $(this.el).find(".captcha-hide");
			this.el[0].onselectstart = function () {
				return false;
			};
			this.createCanvas(this.imgFg_src);
			this.drag();
		}
	}, {
		key: 'createCanvas',
		value: function createCanvas(fg) {
			var imgNub;
			var that = this;
			var ctx = this.canvas[0].getContext("2d");
			this.canvas[0].width = 82; // 78
			this.canvas[0].height = 50; // 45

			this.imgFgBox_el.src = this.imgFgBox_src;
			this.imgFgPic_el.src = fg;
			this.imgFgShadow_el.src = this.imgFgShadow_src;

			this.hideDiv.append(this.imgFgBox_el).append(this.imgFgPic_el).append(this.imgFgShadow_el);
			imgNub = this.hideDiv.children('img').length;
			this.hideDiv.children('img').each(function () {
				$(this).load(function () {
					console.log(imgNub);
					imgNub--;
					if (!imgNub) {
						console.log('ok');
						ctx.save();
						ctx.drawImage(that.imgFgBox_el, 0, 0);
						ctx.globalCompositeOperation = "source-atop";
						ctx.drawImage(that.imgFgPic_el, 0, 0);
						ctx.restore();
						ctx.drawImage(that.imgFgShadow_el, 0, 0);
					}
				});
			});
		}
	}, {
		key: 'reload',
		value: function reload(imgfg, imgbg, y) {
			this.imgFg.attr('src', imgfg).css('top', y);
			this.imgBg.attr('src', imgbg);
		}
	}, {
		key: 'drag',
		value: function drag() {
			var _img_fg = this.imgFg;
			var _drag_left = this.el.outerWidth() - this.btn.outerWidth();
			var that = this;
			// var fnMousedown = function (e) {
			// 	this._x = e.pageX - parseInt($(this).css("left"));
			// 	this.isMove = true;
			// 	e = e;
			// }

			// this.btn.on("mousedown", fnMousedown)

			this.btn.on("mousedown", function (e) {
				that.isActive = that.el.hasClass("true") || that.el.hasClass("false");
				if (!that.isActive) {
					that._x = e.pageX - parseInt(that.btn.css("left"));
					that.isMove = true;
					console.log('down');
					console.log(that.isActive, that.isMove);
				}
			});

			console.log("move");
			$(window).on("mousemove", function (e) {
				if (!that.isActive && that.isMove) {
					that.x = e.pageX - that._x;
					console.log(that.isMove, that.x < _drag_left, that.x >= 0);
					if (that.x >= _drag_left) {
						that.btn.css("left", _drag_left);
						_img_fg.css("left", _drag_left);
					} else if (that.x <= 0) {
						that.btn.css("left", 0);
						_img_fg.css("left", 0);
					} else {
						that.btn.css("left", that.x);
						_img_fg.css("left", that.x);
					}
				}
			});

			$(window).on("mouseup", function (e) {
				console.log(!that.isActive, that.isMove);
				if (!that.isActive && that.isMove) {
					that.isMove = false;

					if (that.x >= that.back_x - 1 && that.x <= that.back_x + 1) {
						that.el.addClass("true");
					} else {
						that.el.addClass("false");
						setTimeout(function () {
							that.x = 0;
							that.btn.animate({ left: that.x });
							_img_fg.animate({ left: that.x });
							that.el.removeClass("false");
						}, 1500);
					}
				}
				that.isMove = false;
			});
		}
	}]);

	return captcha;
}();

// export default captcha;