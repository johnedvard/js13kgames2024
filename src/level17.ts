export default function getLevel() {
  return {
    playerPos: { x: 300, y: 1200 },
    goalPos: { x: 1900, y: 1000 },
    objects: [
      // floor
      { box: { pos: { x: 0, y: 1400 }, width: 1000, height: 150 } },
      // 1st pillar and spike
      { box: { pos: { x: 1300, y: 1700 }, width: 100, height: 1500 } },
      { spike: { pos: { x: 1300, y: 1600 } } },
      // 2nd pillar anmd spike
      { box: { pos: { x: 1540, y: 1700 }, width: 100, height: 1500 } },
      { spike: { pos: { x: 1540, y: 1600 } } },
      // middle floor
      { box: { pos: { x: 1650, y: 1150 }, width: 450, height: 50 } },
      // top floor
      { box: { pos: { x: 1250, y: 800 }, width: 450, height: 50 } },
      // floor nr2
      { box: { pos: { x: 1750, y: 1500 }, width: 900, height: 150 } },
      {
        enemy: {
          pos: { x: 1150, y: 1450 },
          options: { balloonType: "f" },
        },
      },
      {
        enemy: {
          pos: { x: 1400, y: 1350 },
          options: { balloonType: "f" },
        },
      },
      {
        enemy: {
          pos: { x: 900, y: 900 },
          options: { balloonType: "e" },
        },
      },
    ],
  };
}
