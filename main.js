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

		this.box_type = {
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

		// map
		// invisible
		this.map = [];
		this.lost_box_row = 0;
	}

	metro.prototype.packing = function (type) {
		//拼装box
		var packed = 0;
		var box = this.box_type[type];
		var x = this.lost_box_row;
		var map = this.map;
		while (!packed) {
			map[x] = map[x] || [];
			for (var y = 0; y < this.col; y++) {
				packed = 1;
				if (y > (this.col - box.w)) {
					packed = 0;
				} else {
					for (var i = 0; i < box.h; i++) {
						map[x + i] = map[x + i] || [];
						for (var j = 0; j < box.w; j++) {
							if (map[x + i][y + j]) {
								packed = 0;
							}
						}
					}
				}

				this.map = map;

				if (packed) {
					for (var i = 0; i < box.h; i++) {
						for (var j = 0; j < box.w; j++) {
							map[x + i][y + j] = 1;
						}
					}

					var style = {
						"top": this.box_h * x + "px",
						"left": this.box_w * y + "px",
						"width": this.box_w * box.w + "px",
						"height": this.box_h * box.h + "px"
					}
					return style;
				}
			}
			x++;
		}
	}

	/* relayout */
	metro.prototype.relayout = function() {
		var boxes = document.querySelector("#metro").childNodes;
		var style = {};
		this.lost_box_row = 0;
		this.map = [];
		for (var i = 0, len = boxes.length; i < len; i++) {
			if(boxes[i].nodeType == 1) {
				style = this.packing(genBox("rand"));
				boxes[i].setStyle(style);
			}
		}
		this.lost_box_row = getLostBoxRow(this.lost_box_row, this.col, this.map) || this.lost_box_row;
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

		// 通过模板生成方块html
		var tpl = tpl || document.querySelector("#box-tpl").innerHTML;
		var html = "";
		var data = "";
		var box = "b1";
		for (var i = 0, len = json.length; i < len; i++) {
			box = genBox(this.order, json[i]);
			data = this.packing(box);
			data["box"] = box;
			html += tplEngine(tpl, data);
		}
		this.container.appendHTML(html);
		this.lost_box_row = getLostBoxRow(this.lost_box_row, this.col, this.map) || this.lost_box_row;
	}

	metro.prototype.defineBox = function(name, w, h) {
		this.box_type[name] = {
			w: w,
			h: h
		}
	}

	metro.prototype.order = function(layout) {
		this.order = layout;
	}

	function getLostBoxRow(row, col, map) {
		//	计算未填充的方格
		for (var i = row; i < map.length; i++) {
			for (var j = 0; j < col; j++) {
				if (!map[i][j]) {
					return i;
				}
			}
		}
	}

	function genBox(mode, json) {
		if (mode == "rand") {
			//生成随机方块
			var rand = Math.random();
			var box_type = "b1";
			(rand < 0.9) && (box_type = "b2");
			(rand < 0.8) && (box_type = "b3");
			(rand < 0.7) && (box_type = "b4");
			(rand < 0.6) && (box_type = "b5");
			(rand < 0.5) && (box_type = "b6");
			(rand < 0.4) && (box_type = "b7");
			(rand < 0.3) && (box_type = "b8");
			(rand < 0.2) && (box_type = "b9");
			(rand < 0.1) && (box_type = "b1");

			return box_type;
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

	Object.prototype.setStyle = function (style) {
		for(var i in style) {
			this.style[i] = style[i];
		}
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
		// front.loadBoxes("init", json);
		front.relayout();
	}, 100);
}

document.querySelector("#init").onclick = function() {
	front.relayout();
}
document.querySelector("#add").onclick = function() {
	front.loadBoxes("add", json);
}