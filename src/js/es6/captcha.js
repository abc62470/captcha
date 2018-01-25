/* eslint-disable*/
/* eslint-env browser*/
import $ from "jquery";

class captcha {
	constructor(el, y, fg, bg) {
		this.isActive = false;
		this.isMove = false;
		this.id = el;
		this.el = $('#'+ this.id);
		this.x = 0;
		this.y = parseInt(y);
		// this.y = 28;
		// this.imgFg_src = '/images/captcha_fg.png';
		// this.imgBg_src = '/images/captcha_1.jpg';
		this.imgFg_src = fg;
		this.imgBg_src = bg;
		this.imgFgBox_src = './images/box.png';
		this.imgFgShadow_src = './images/captcha_fg_shadow.png';

		this.imgFgPic_el = document.createElement('img');
		this.imgFgBox_el = document.createElement('img');
		this.imgFgShadow_el = document.createElement('img');
		this.canvas = $(`<canvas><img src="${this.imgFg_src}" /></canvas>`);
		this.back_x = 205;

		this.textHTML = `请拖动滑块完成验证 >>`;
		this.imgHTML = `<div class="captcha-img">
					    <img class="captcha-img-bg" src="${this.imgBg_src}" alt="img">
					    <div class="captcha-img-fg"></div>
					</div>`;
		this.btnHTML = `<div class="captcha-btn"> > </div>`;
		this.noneHTML = `<div class="captcha-hide"></div>`;
	}

	init(){
		this.el.empty();
		this.el.append(this.textHTML + this.imgHTML + this.btnHTML + this.noneHTML);
		this.el.find(".captcha-img .captcha-img-fg").append(this.canvas);
		this.imgFg = $(this.el).find(".captcha-img-fg").css('top', this.y);
		this.imgBg = $(this.el).find(".captcha-img-bg");
		this.btn = $(this.el).find(".captcha-btn");
		this.hideDiv = $(this.el).find(".captcha-hide");
		this.el[0].onselectstart = function () {
			return false;
		}
		this.createCanvas(this.imgFg_src);
		this.drag();
	}

	createCanvas(fg){
		var imgNub;
		var that = this;
		var ctx = this.canvas[0].getContext("2d");
		this.canvas[0].width = 82; // 78
		this.canvas[0].height = 50;// 45

		this.imgFgBox_el.src = this.imgFgBox_src;
		this.imgFgPic_el.src = fg;
		this.imgFgShadow_el.src = this.imgFgShadow_src;

		this.hideDiv.append(this.imgFgBox_el).append(this.imgFgPic_el).append(this.imgFgShadow_el);
		imgNub = this.hideDiv.children('img').length;
		this.hideDiv.children('img').each(function () {
			$(this).load(function () {
				imgNub--;
				if (!imgNub) {
					ctx.save();
					ctx.drawImage(that.imgFgBox_el,0,0);
					ctx.globalCompositeOperation="source-atop";
					ctx.drawImage(that.imgFgPic_el,0,0);
					ctx.restore();
					ctx.drawImage(that.imgFgShadow_el,0,0);
				}
			})

		})
		
	}

	submit() {
		var that = this;
	    $.ajax({
	        url: gethost() + "VerifyCodeHandler.ashx?t=" + Math.random(),
	        dataType: "json",
	        data: { action: "verify", x: this.x },
	        cache: false,
	        success: function (data) {
	            if(data.result=="ok"){
	              // console.log("成功");
	              that.el.addClass("true");
	           } else{
		              // console.log("失败");
					that.el.addClass("false");
					setTimeout( () => {
						that.x = 0;
						that.btn.animate({left:that.x});
						that.imgFg.animate({left:that.x},function () {
							that.el.removeClass("false");
							getimgs();
						});
					},1500)
	           }
	        }
	    });
	}

	drag(){
		var _drag_left = this.el.outerWidth() - this.btn.outerWidth();
		var that = this;
/*
		this.el.on("mouseenter", function () {
			$(this).find(".captcha-img").stop(true,true);
			$(this).find(".captcha-img").fadeIn(300);
		})

		this.el.on("mouseleave", function () {
			$(this).find(".captcha-img").stop(true,true);
			$(this).find(".captcha-img").fadeOut(300);
		})*/


		this.btn.on("mousedown", function (e) {
			that.isActive = that.el.hasClass("true") || that.el.hasClass("false");
			if (!that.isActive) {
				that._x = e.pageX - parseInt(that.btn.css("left"));
				that.isMove = true;
				// console.log('down');
			}
		});

		$(window).on("mousemove", function (e) {
			e.preventDefault();
			if (!that.isActive && that.isMove) {
				// console.log("move");
					that.x = e.pageX - that._x;
				if (that.x >= _drag_left) {
					that.btn.css("left", _drag_left);
					that.imgFg.css("left", _drag_left);
				} else if(that.x <= 0){
					that.btn.css("left", 0);
					that.imgFg.css("left", 0);
				} else{
					that.btn.css("left", that.x);
					that.imgFg.css("left", that.x);
				}
			}
		})



		$(window).on("mouseup", function(e){
			// console.log("up");
			if (!that.isActive && that.isMove) {
				that.isMove = false;

				// that.submit();

				if (that.x >= that.back_x-1 && that.x <= that.back_x+1) {
					that.el.addClass("true");
				} else{
					that.el.addClass("false");
					setTimeout( () => {
						that.x = 0;
						that.btn.animate({left:that.x});
						that.imgFg.animate({left:that.x},function () {
							that.el.removeClass("false");
						});
					},1500)
				}
				
			}
			that.isMove = false;
		})

		


	}
}

export default captcha;