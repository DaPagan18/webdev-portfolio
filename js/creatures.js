// Defines the sea creatures and their shapes (exactly as in your Java logic)

const CREATURES = [
  {
    name: "Crab",
    icon: "🦀",
    shapes: [
      [{dx: 0, dy: 0}]
    ]
  },
  {
    name: "Fish",
    icon: "🐟",
    shapes: [
      // horizontal
      [{dx: 0, dy: 0}, {dx: 0, dy: 1}],
      // vertical
      [{dx: 0, dy: 0}, {dx: 1, dy: 0}]
    ]
  },
  {
    name: "Shark",
    icon: "🦈",
    shapes: [
      // horizontal hook
      [
        {dx: 0, dy: 0},
        {dx: 0, dy: 1},
        {dx: 0, dy: 2},
        {dx: 0, dy: 3},
        {dx: -1, dy: 2}
      ],
      // vertical hook
      [
        {dx: 0, dy: 0},
        {dx: 1, dy: 0},
        {dx: 2, dy: 0},
        {dx: 3, dy: 0},
        {dx: 2, dy: -1}
      ]
    ]
  },
  {
    name: "Pufferfish",
    icon: "🐡",
    shapes: [
      [
        {dx: 0, dy: 0},
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: 1, dy: 1}
      ]
    ]
  },
  {
    name: "Octopus",
    icon: "🐙",
    shapes: [
      [
        {dx: 0, dy: 2},
        {dx: 1, dy: 1}, {dx: 1, dy: 3},
        {dx: 2, dy: 0}, {dx: 2, dy: 2}, {dx: 2, dy: 4},
        {dx: 3, dy: 1}, {dx: 3, dy: 3},
        {dx: 4, dy: 2}
      ]
    ]
  }
];