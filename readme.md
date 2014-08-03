# 使用范围
目前仅用于ajax同步后取得json，进行插入前布局

# 用法
## new metro(col, container, tpl);
	初始化插件
	col 布局里的列数
	container 容器
	tpl 模版

## defineBox(name, width, height)
	定义各个方格
	name 方格名
	width 方格宽（以1为单位）
	height 方格高（以1为单位）

## loadCards("resize" | "add", json)
	加载方格
	resize 清空容器再加载
	add 在当前基础上继续加载
	json 用来拼装的数据

# 将添加的功能
## 动画
## 对已有dom树进行布局
## 添加jquery版本（或直接对各浏览器进行兼容）