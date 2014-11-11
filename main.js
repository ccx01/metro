(function() {

	/******layout******/

	var metro = function(config) {
		//地图分区布局变量
		/*
			box: 地图分区数组
			row: 当前排列到的行数
			col: 显示的列数
			container: metro容器
			tpl: 用来拼装json的模板
		*/

		this.grid = {
			b1: {
				w: 1,
				h: 1
			},
			b2: {
				w: 2,
				h: 1
			},
			b3: {
				w: 1,
				h: 2
			},
			b4: {
				w: 2,
				h: 2
			}
		};
		this.box = [];
		this.row = 0;
		this.col = Math.max((config.col || 9), 2);
		this.container = config.container || document.querySelector('#metro');
		this.box_h = this.box_w = this.container.offsetWidth / this.col;
		this.order = config.order || "rand";
		this.animation = config.animation || false;
	}
	metro.prototype.init = function() {
		this.col = Math.max(this.col, 2); //min-col: 2
		this.row = 0;
		this.box = [];
		this.box_h = this.box_w = this.container.offsetWidth / this.col;
		this.container.innerHTML = '';
	}
	metro.prototype.loadBoxes = function(mode, json) {

		switch (mode) {
			case "init":
				this.init();
				break;
				/*case "add":
							// this.container.insertAdjacentHTML('afterend', box_html);
							// this.container.appendHTML(box_html);
							break;*/
		}
		if (this.animation) {
			// 有动画的拼装方式
		} else {
			boxHtml(this, json);
		}
	}
	metro.prototype.defineBox = function(name, w, h) {
		this.grid[name] = {
			w: w,
			h: h
		}
	}
	metro.prototype.order = function(layout) {
		this.order = layout;
	}

	/* relayout */
	/*metro.prototype.relayout = function() {
		var boxes = document.querySelector("#metro").childNodes;
		var json = {};
		this.row = 0;
		for (var i = 0, len = boxes.length; i < len; i++) {
			if(boxes[i].nodeType == 1) {
				json["box"] = "b1";
				json = packing(this, json);
				boxes[i].style.top = json["top"];
				boxes[i].style.left = json["left"];
				boxes[i].style.width = json["width"];
				boxes[i].style.height = json["height"];
				console.log(boxes[i]);
			}
		}
	}*/


	function boxHtml(self, json, tpl) {
		// 通过模板生成方块html
		var tpl = tpl || document.querySelector("#box-tpl").innerHTML;
		var html = "";
		var data = "";
		for (var i = 0, len = json.length; i < len; i++) {
			genBox(self.order, json[i]);
			data = packing(self, json[i]);
			html += tplEngine(tpl, data);
		}
		self.container.appendHTML(html);
		self.row = missingBox(self.row, self.col, self.box) || self.row;
	}

	function packing(self, json) {
		/***
		self: 本体
		json: 需要拼装的数据
		***/
		//拼装json位置
		var packed = 0;
		var grid = self.grid[json.box];
		var x = self.row;
		var box = self.box;
		while (!packed) {
			box[x] = box[x] || [];
			for (var y = 0; y < self.col; y++) {
				packed = 1;
				if (y > (self.col - grid.w)) {
					packed = 0;
				} else {
					for (var i = 0; i < grid.h; i++) {
						box[x + i] = box[x + i] || [];
						for (var j = 0; j < grid.w; j++) {
							if (box[x + i][y + j]) {
								packed = 0;
							}
						}
					}
				}

				self.box = box;

				if (packed) {
					for (var i = 0; i < grid.h; i++) {
						for (var j = 0; j < grid.w; j++) {
							box[x + i][y + j] = 1;
						}
					}
					json.top = self.box_h * x;
					json.left = self.box_w * y;
					json.width = self.box_w * grid.w;
					json.height = self.box_h * grid.h;
					return json;
				}
			}
			x++;
		}
	}

	function missingBox(row, col, box) {
		//	计算未填充的方格
		for (var i = row; i < box.length; i++) {
			for (var j = 0; j < col; j++) {
				if (!box[i][j]) {
					return i;
				}
			}
		}
	}

	function genBox(mode, json) {
		if (mode == "rand") {
			//生成随机方块
			var rand = Math.random();
			json["box"] = "b1";
			(rand < 0.9) && (json["box"] = "b2");
			(rand < 0.8) && (json["box"] = "b3");
			(rand < 0.7) && (json["box"] = "b4");
			(rand < 0.6) && (json["box"] = "b5");
			(rand < 0.5) && (json["box"] = "b6");
			(rand < 0.4) && (json["box"] = "b7");
			(rand < 0.3) && (json["box"] = "b8");
			(rand < 0.2) && (json["box"] = "b9");
			(rand < 0.1) && (json["box"] = "b1");
		}
	}

	function parseDom(html) {
		var div_tmp = document.createElement("div");
		div_tmp.innerHTML = html;
		return div_tmp.childNodes;
	}

	HTMLElement.prototype.appendHTML = function(html) {
		var nodes = parseDom(html);
		var fragment = document.createDocumentFragment();
		var i = 0;
		while (nodes[i]) {
			// console.log(nodes[i].nodeType);
			fragment.appendChild(nodes[i].cloneNode(true));
			i++;
		}
		this.appendChild(fragment);
	}

	function tplEngine(tpl, data) {
		var re = /{#(\w+)?}/;
		while (match = re.exec(tpl)) {
			tpl = tpl.replace(match[0], data[match[1]]);
		}
		return tpl;
	}




	window.metro = metro;

}());


var config = {
	"col": 25
}

var json = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},  {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
// var json = [{},{}];
// var container = document.querySelector('#front');
// var tpl = document.querySelector("#box-tpl").innerHTML;
var front = new metro(config);
// front.init();
/*front.defineBox("b1", 1, 1);
front.defineBox("b2", 2, 1);
front.defineBox("b3", 1, 2);
front.defineBox("b4", 2, 2);*/
front.defineBox("b5", 1, 3);
front.defineBox("b6", 2, 3);
front.defineBox("b7", 3, 3);
front.defineBox("b8", 3, 1);
front.defineBox("b9", 3, 2);
front.loadBoxes("init", json);

var responsive = document.body.offsetWidth / config.col | 0;
var t = setTimeout(function(){}, 1000);
window.onresize = function() {
	clearTimeout(t);
	t = setTimeout(function() {
		front.col = document.body.offsetWidth / responsive | 0;
		front.loadBoxes("init", json);
	}, 100);
}

document.querySelector("#init").onclick = function() {
	front.loadBoxes("init", json);
}
document.querySelector("#add").onclick = function() {
	front.loadBoxes("add", json);
	front.relayout();
}