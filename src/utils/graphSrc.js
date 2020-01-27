export const graphDot = `digraph "graph_apple_cake410_1_1_20sum.gv" {
	rankdir=LR ratio=auto
	{
		rank=source
		0
	}
	{
		rank=same
		3936
		4094
	}
	{
		rank=same
		4261
		2665
		4244
		4292
		4373
	}
	{
		rank=same
		4411
		3728
		3893
		4401
	}
	{
		rank=same
		4024
		4356
		4397
		4403
		4363
	}
	{
		rank=same
		3905
		4410
		4413
	}
	{
		rank=sink
		1
	}
	2665 [label=<<font point-size='18'><b>flour</b><br/>flour (75.00%)</font>> fillcolor="#fefefe" style=filled]
	3728 [label=<<font point-size='18'><b>sift</b><br/>flour (100%)<br/>salt (95.65%)<br/>cinnamon (73.91%)<br/>baking powder (60.87%)</font>> fillcolor="#f8f8f8" style=filled]
	3893 [label=<<font point-size='18'><b>mix</b><br/>flour (100%)<br/>salt (100%)<br/>baking powder (53.57%)<br/>baking soda (53.57%)</font>> fillcolor="#f7f7f7" style=filled]
	3905 [label=<<font point-size='18'><b>beat</b><br/>butter (100%)<br/>white sugar (52.63%)<br/>brown sugar (31.58%)<br/>sugar (21.05%)</font>> fillcolor="#f9f9f9" style=filled]
	3936 [label=<<font point-size='18'><b>beat</b><br/>butter (93.75%)<br/>sugar (87.50%)<br/>egg (18.75%)<br/>water (12.50%)</font>> fillcolor="#fafafa" style=filled]
	4024 [label=<<font point-size='18'><b>mix</b><br/>apple (100%)<br/>walnut (50.00%)<br/>pecan (28.57%)<br/>raisin (21.43%)</font>> fillcolor="#fbfbfb" style=filled]
	4094 [label=<<font point-size='18'><b>preheat</b></font>> fillcolor="#f6f6f6" style=filled]
	4244 [label=<<font point-size='18'><b>grease</b><br/>cooking spray (100%)</font>> fillcolor="#fcfcfc" style=filled]
	4261 [label=<<font point-size='18'><b>add</b><br/>egg (97.62%)<br/>oil (11.90%)<br/>vanilla (9.52%)<br/>milk (7.14%)</font>> fillcolor="#f3f3f3" style=filled]
	4292 [label=<<font point-size='18'><b>grease</b></font>> fillcolor="#f4f4f4" style=filled]
	4356 [label=<<font point-size='18'><b>roll</b><br/>apple (100%)<br/>walnut (42.86%)<br/>raisin (14.29%)<br/>banana (5.71%)</font>> fillcolor="#f5f5f5" style=filled]
	4363 [label=<<font point-size='18'><b>bake</b></font>> fillcolor="#a4a4a4" style=filled]
	4373 [label=<<font point-size='18'><b>flour</b><br/>flour (100%)<br/>butter (7.89%)<br/>brown sugar (2.63%)</font>> fillcolor="#f4f4f4" style=filled]
	4397 [label=<<font point-size='18'><b>pour</b></font>> fillcolor="#dadada" style=filled]
	4401 [label=<<font point-size='18'><b>place</b></font>> fillcolor="#e2e2e2" style=filled]
	4403 [label=<<font point-size='18'><b>set</b></font>> fillcolor="#fcfcfc" style=filled]
	4410 [label=<<font point-size='18'><b>remove</b></font>> fillcolor="#f0f0f0" style=filled]
	4411 [label=<<font point-size='18'><b>mix</b></font>> fillcolor="#e4e4e4" style=filled]
	4413 [label=<<font point-size='18'><b>cool</b></font>> fillcolor="#cfcfcf" style=filled]
	0 [label=START fillcolor="#ffffff" style=filled]
	1 [label=END fillcolor="#ffffff" style=filled]
	0 [label=<<font point-size='18'><b>START</b></font>> shape=doublecircle style=bold]
	1 [label=<<font point-size='18'><b>END</b></font>> shape=doublecircle style=bold]
	2665 -> 3728 [label=4 penwidth=1.0705882352941176]
	4094 -> 2665 [label=9 penwidth=1.2470588235294118]
	4373 -> 3728 [label=4 penwidth=1.0705882352941176]
	3728 -> 4403 [label=19 penwidth=1.6]
	4244 -> 3893 [label=2 penwidth=1.0]
	3893 -> 4411 [label=4 penwidth=1.0705882352941176]
	3905 -> 4261 [label=5 penwidth=1.1058823529411765]
	4403 -> 3905 [label=5 penwidth=1.1058823529411765]
	3936 -> 4261 [label=3 penwidth=1.035294117647059]
	4024 -> 4397 [label=8 penwidth=1.2117647058823529]
	4411 -> 4024 [label=4 penwidth=1.0705882352941176]
	4094 -> 4244 [label=8 penwidth=1.2117647058823529]
	4094 -> 4292 [label=39 penwidth=2.3058823529411763]
	4094 -> 4373 [label=44 penwidth=2.4823529411764707]
	4261 -> 4411 [label=12 penwidth=1.3529411764705883]
	4292 -> 4401 [label=2 penwidth=1.0]
	4356 -> 4397 [label=24 penwidth=1.7764705882352942]
	4356 -> 4401 [label=7 penwidth=1.1764705882352942]
	4411 -> 4356 [label=7 penwidth=1.1764705882352942]
	4397 -> 4363 [label=68 penwidth=3.3294117647058825]
	4401 -> 4363 [label=24 penwidth=1.7764705882352942]
	4363 -> 4410 [label=10 penwidth=1.2823529411764705]
	4363 -> 4413 [label=70 penwidth=3.4000000000000004]
	4411 -> 4397 [label=7 penwidth=1.1764705882352942]
	4411 -> 4401 [label=7 penwidth=1.1764705882352942]
	4410 -> 4413 [label=6 penwidth=1.1411764705882352]
	0 -> 3936 [label=6 penwidth=1.1411764705882352]
	0 -> 4094 [label=172 penwidth=7.0]
	4363 -> 1 [label=25 penwidth=1.811764705882353]
	4413 -> 1 [label=25 penwidth=1.811764705882353]
	labelloc="t"
	label="Apple cake (12 servings)\\n\\n"
	fontsize=50
}`
