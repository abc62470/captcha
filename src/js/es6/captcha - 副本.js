/* eslint-disable*/
/* eslint-env browser*/
import $ from "jquery";

class captcha {
	constructor(el) {
		this.isMove = false;
		this.id = el;
		this.el = $('#'+ this.id);
		this.x = 0;
		this.back_x = 202;
		this.imgHTML = `<div class="captcha-img">
					    <img class="captcha-img-bg" src="images/captcha_1.jpg" alt="img">
					    <img class="captcha-img-fg" src="images/captcha_fg.png" alt="img">
					</div>`;
		this.btnHTML = `<div class="captcha-btn"> > </div>`;
	}

	init(){
		this.el.append(this.imgHTML + this.btnHTML);
		this.img = $(this.el).find(".captcha-img-fg");
		this.btn = $(this.el).find(".captcha-btn");
		this.el[0].onselectstart = function () {
			return false;
		}
	}

	drag(){
		var _img_fg = this.img;
		var _drag_left = this.el.outerWidth() - this.btn.outerWidth();
		var that = this;
		// var fnMousedown = function (e) {
		// 	this._x = e.pageX - parseInt($(this).css("left"));
		// 	this.isMove = true;
		// 	e = e;
		// }

		// this.btn.on("mousedown", fnMousedown)

		this.btn.on("mousedown", function (e) {
			this.isActive = that.el.hasClass("true") || that.el.hasClass("false");
				console.log(this._x , e.pageX , parseInt($(this).css("left")));
			if (!this.isActive) {
				this._x = e.pageX - parseInt($(this).css("left"));
				this.isMove = true;
				console.log('down');
			}
		});

		this.btn.on("mousemove", function (e) {
			
				this.x = e.pageX - this._x;
				// console.log(this.x,e.pageX, this._x);
			if (this.isMove && this.x < _drag_left && this.x >= 0) {
				$(this).css("left", this.x);
				_img_fg.css("left", this.x);
			} else{
				this.isMove = false;
			}
		})

		

		this.btn.on("mouseup", function(e){
			if (!this.isActive) {
				if (this.x >= that.back_x-1 && this.x <= that.back_x+1) {
					that.el.addClass("true");
					// $(this).unbind("mousedown");
				} else{
					that.el.addClass("false");
					// $(this).unbind("mousedown", fnMousedown);
					setTimeout( () => {
						that.x = 0;
						$(this).animate({left:that.x});
						_img_fg.animate({left:that.x});
						that.el.removeClass("false");
					},1500)
				}
				
			}
			this.isMove = false;
		})
	}
}

export default captcha;