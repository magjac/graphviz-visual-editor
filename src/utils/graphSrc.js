export const graphDot = `digraph "graph_apple_cake_try.gv" {
    \trankdir=LR ratio=auto
    \t{
    \t\trank=source
    \t\t0
    \t}
    \t{
    \t\trank=sink
    \t\t1
    \t}
    \t3902 [label="(3902)\\n\\nmix\\n\\n1 - 3 egg (82%)\\n1/2 cup - 1 1/2 cup sugar (76%)\\n1/4 cup - 1 1/4 cup oil (70%)\\n1 teaspoon - 2 teaspoon vanilla (23%)\\n1 3/4 cup - 2 cup white sugar (11%)\\n1 cup vegetable oil (5%)\\n1 cup brown sugar (5%)\\n1 tablespoon - 1 1/2 tablespoon molasses (5%)\\n\\nbowl (99%)\\nmixer (23%)" fillcolor="#ecf3fb" style=filled]
    \t4108 [label="(4108)\\n\\npreheat\\n\\noven (99%)\\nbaking dish (6%)" fillcolor="#e1edf8" style=filled]
    \t4263 [label="(4263)\\n\\nroll\\n\\n3 slice - 3 apple (100%)\\n1/2 cup - 1 cup walnut (55%)\\n1/2 cup raisin (22%)\\n1 cup coconut (11%)\\n1 1/2 cup pecan (5%)\\n3/4 cup banana (5%)" fillcolor="#ebf3fb" style=filled]
    \t4294 [label="(4294)\\n\\nmix\\n\\n3 slice - 4 apple (100%)\\n3/4 cup - 1 cup walnut (15%)\\n1 3/4 cup - 3 cup flour (8%)\\n1/2 cup raisin (6%)\\n1/2 cup - 3/4 cup pecan (6%)\\n1 tablespoon - 1 1/2 tablespoon lemon juice (6%)\\n1/2 teaspoon - 1 teaspoon vanilla extract (4%)\\n3 tablespoon - 1/4 cup sugar (4%)\\n1/2 teaspoon - 1/2 tablespoon cinnamon (4%)\\n2 cup zucchini (2%)\\n10 ounce - 11 ounce sauerkraut (2%)\\n3/4 cup - 1 cup chocolate chip (2%)\\n1 lemon (2%)\\n3 slice pear (2%)\\n1 cup - 1 1/4 cup cold water (2%)\\n1/2 cup cinnamon chip (2%)\\n2 - 3 egg (2%)\\n1 1/2 - 1 3/4 millet (2%)\\n16 caramel (2%)\\n\\nbowl (8%)\\nbaking dish (2%)" fillcolor="#d7e6f4" style=filled]
    \t4402 [label="(4402)\\n\\npour\\n\\npan (62%)\\nbaking dish (4%)\\nplate (3%)\\nrice steamer (1%)\\noven (1%)\\n\\n2 minute - 1 hour" fillcolor="#a5cde3" style=filled]
    \t4416 [label="(4416)\\n\\nmix\\n\\nmixer (2%)\\nspatula (1%)\\npan (1%)\\n\\n3 minute - 5 minute" fillcolor="#bed7ec" style=filled]
    \t0 [label="(0)\\n\\nSTART" fillcolor="#f7fbff" style=filled]
    \t1 [label="(1)\\n\\nEND" fillcolor="#f7fbff" style=filled]
    \t0 [label=<<font point-size='18'><b>START</b></font>> shape=doublecircle style=bold]
    \t1 [label=<<font point-size='18'><b>END</b></font>> shape=doublecircle style=bold]
    \t3902 -> 4416 [label=2 penwidth=1.0]
    \t0 -> 3902
    \t4108 -> 4294
    \t4263 -> 4402 [label=12 penwidth=1.3529411764705883]
    \t4416 -> 4263 [label=4 penwidth=1.0705882352941176]
    \t4294 -> 4402 [label=15 penwidth=1.4588235294117649]
    \t4416 -> 4294 [label=3 penwidth=1.035294117647059]
    \t4416 -> 4402 [label=7 penwidth=1.1764705882352942]
    \t0 -> 4108 [label=172 penwidth=7.0]
    \t4402 -> 1 [label=25 penwidth=1.811764705882353]
    \t4294 -> 1
    }`