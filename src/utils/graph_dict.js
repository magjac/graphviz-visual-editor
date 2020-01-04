export const graphDict = {
  "0": {
    "color": "#f7fbff",
    "hidden": false,
    "marked": false,
    "verb": null,
    "ingredients": null,
    "ingredients_abbr": null,
    "tool": null,
    "tool_abbr": null,
    "time": null,
    "oven_heat": null,
    "out_edges": [
      [
        "3902",
        1,
        1.0
      ],
      [
        "4108",
        1,
        1
      ]
    ],
    "in_edges": [
      
    ]
  },
  "1": {
    "color": "#f7fbff",
    "hidden": false,
    "marked": false,
    "verb": null,
    "ingredients": null,
    "ingredients_abbr": null,
    "tool": null,
    "tool_abbr": null,
    "time": null,
    "oven_heat": null,
    "out_edges": [
      
    ],
    "in_edges": [
      "4402",
      "4294"
    ]
  },
  "3902": {
    "directions": [
      {
        "title": "In a large bowl, mix together the eggs and sugar until blended.",
        "constraint": "GOOD"
      },
      {
        "title": "In a large bowl, mix together the eggs and sugar.",
        "constraint": "NEUTRAL"
      },
      {
        "title": "Combine eggs, oil and sugar in large bowl with electric mixer.",
        "constraint": "BAD"
      }
    ],
    "color": "#e1edf8",
    "hidden": false,
    "marked": false,
    "verb": "mix",
    "ingredients": "1 - 3 egg (82%)\n1/2 cup - 1 1/2 cup sugar (76%)\n1/4 cup - 1 1/4 cup oil (70%)\n1 teaspoon - 2 teaspoon vanilla (23%)\n1 3/4 cup - 2 cup white sugar (11%)\n1 cup vegetable oil (5%)\n1 cup brown sugar (5%)\n1 tablespoon - 1 1/2 tablespoon molasses (5%)\n\nbowl (99%)\nmixer (23%)",
    "ingredients_abbr": "1 - 3 egg (82%)\n1/2 cup - 1 1/2 cup sugar (76%)\n",
    "tool": null,
    "tool_abbr": null,
    "time": null,
    "oven_heat": null,
    "out_edges": [
      [
        "4416",
        12,
        1.0
      ]
    ],
    "in_edges": [
      "0"
    ]
  },
  "4108": {
    "directions": [
      {
        "title": "Preheat oven to 350 degrees F. Grease two large six-cup muffin tins.",
        "constraint": "GOOD"
      },
      {
        "title": "Preheat an oven to 350 degrees F (175 degrees C).",
        "constraint": "NEUTRAL"
      }
    ],
    "color": "#e1edf8",
    "hidden": false,
    "marked": false,
    "verb": "preheat",
    "ingredients": null,
    "ingredients_abbr": null,
    "tool": "oven (99%)\nbaking dish (6%)",
    "tool_abbr": "oven (99%)\nbaking dish (6%)\n",
    "time": null,
    "oven_heat": null,
    "out_edges": [
      [
        "4294",
        1,
        7.0
      ]
    ],
    "in_edges": [
      "0"
    ]
  },
  "4263": {
    "directions": [
      {
        "title": "Gently roll apple, banana, and raisins into batter.",
        "constraint": "BAD"
      },
      {
        "title": "roll apples and 1 1/2 cups walnuts into batter.",
        "constraint": "BAD"
      }
    ],
    "color": "#e1edf8",
    "hidden": true,
    "marked": false,
    "verb": "roll",
    "ingredients": "3 slice - 3 apple (100%)\n1/2 cup - 1 cup walnut (55%)\n1/2 cup raisin (22%)\n1 cup coconut (11%)\n1 1/2 cup pecan (5%)\n3/4 cup banana (5%)",
    "ingredients_abbr": "3 slice - 3 apple (100%)\n1/2 cup - 1 cup walnut (55%)\n",
    "tool": null,
    "tool_abbr": null,
    "time": null,
    "oven_heat": null,
    "out_edges": [
      [
        "4402",
        12,
        1.0
      ]
    ],
    "in_edges": [
      "4416"
    ]
  },
  "4294": {
    "directions": [
      {
        "title": "mix into the apple mixture.",
        "constraint": "GOOD"
      }
    ],
    "color": "#bed7ec",
    "hidden": false,
    "marked": false,
    "verb": "mix",
    "ingredients": "3 slice - 4 apple (100%)\n3/4 cup - 1 cup walnut (15%)\n1 3/4 cup - 3 cup flour (8%)\n1/2 cup raisin (6%)\n1/2 cup - 3/4 cup pecan (6%)\n1 tablespoon - 1 1/2 tablespoon lemon juice (6%)\n1/2 teaspoon - 1 teaspoon vanilla extract (4%)\n3 tablespoon - 1/4 cup sugar (4%)\n1/2 teaspoon - 1/2 tablespoon cinnamon (4%)\n2 cup zucchini (2%)\n10 ounce - 11 ounce sauerkraut (2%)\n3/4 cup - 1 cup chocolate chip (2%)\n1 lemon (2%)\n3 slice pear (2%)\n1 cup - 1 1/4 cup cold water (2%)\n1/2 cup cinnamon chip (2%)\n2 - 3 egg (2%)\n1 1/2 - 1 3/4 millet (2%)\n16 caramel (2%)\n\nbowl (8%)\nbaking dish (2%)",
    "ingredients_abbr": "3 slice - 4 apple (100%)\n3/4 cup - 1 cup walnut (15%)\n",
    "tool": null,
    "tool_abbr": null,
    "time": null,
    "oven_heat": null,
    "out_edges": [
      [
        "4402",
        1,
        1
      ],
      [
        "1",
        1,
        1
      ]
    ],
    "in_edges": [
      "4416",
      "4108"
    ]
  },
  "4402": {
    "directions": [
      {
        "title": "Pour sauce slowly over the cake, filling all the holes and letting it soak in evenly.",
        "constraint": "GOOD"
      }
    ],
    "color": "#bed7ec",
    "hidden": false,
    "marked": false,
    "verb": "pour",
    "ingredients": null,
    "ingredients_abbr": null,
    "tool": "pan (62%)\nbaking dish (4%)\nplate (3%)\nrice steamer (1%)\noven (1%)\n",
    "tool_abbr": "pan (62%)\nbaking dish (4%)\n",
    "time": null,
    "oven_heat": null,
    "out_edges": [
      [
        "1",
        1,
        1
      ]
    ],
    "in_edges": [
      "4416",
      "4294",
      "4263"
    ]
  },
  "4416": {
    "directions": [
      {
        "title": "Mix until completely smooth, 5 to 10 minutes.",
        "constraint": "GOOD"
      }
    ],
    "color": "#bed7ec",
    "hidden": false,
    "marked": false,
    "verb": "mix",
    "ingredients": null,
    "ingredients_abbr": null,
    "tool": "mixer (2%)\nspatula (1%)\npan (1%)\n",
    "tool_abbr": "mixer (2%)\nspatula (1%)\n",
    "time": "3 minute - 5 minute",
    "oven_heat": null,
    "out_edges": [
      [
        "4263",
        1,
        1
      ],
      [
        "4294",
        1,
        7
      ],
      [
        "4402",
        1,
        1
      ]
    ],
    "in_edges": [
      "3902"
    ]
  }
}