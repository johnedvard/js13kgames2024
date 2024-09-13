export default function getLevel() {
  return {
    playerPos: { x: 260, y: 1300 },
    goalPos: { x: 2570, y: 1080 },
    objects: [
      // floor
      { box: { pos: { x: 0, y: 1400 }, width: 4300, height: 175 } },
      // first small box
      { box: { pos: { x: 850, y: 800 }, width: 100, height: 100 } },
      // top most box
      { box: { pos: { x: 1500, y: 500 }, width: 100, height: 100 } },
      // longer middle box
      { box: { pos: { x: 1250, y: 800 }, width: 650, height: 100 } },
      // 1st box on floor
      { box: { pos: { x: 2400, y: 1250 }, width: 100, height: 150 } },
      // 2nd box on floor
      { box: { pos: { x: 3060, y: 1080 }, width: 150, height: 320 } },
      {
        enemy: {
          pos: { x: 1400, y: 1350 },
          options: { balloonType: "f" },
        },
      },
      {
        enemy: {
          pos: { x: 2100, y: 1100 },
          options: { balloonType: "f" },
        },
      },
      {
        enemy: {
          pos: { x: 2100, y: 1100 },
          options: { balloonType: "e" },
        },
      },
      {
        enemy: {
          pos: { x: -100, y: 1200 },
          options: { balloonType: "e" },
        },
      },
      { spike: { pos: { x: 2250, y: 1300 } } },
      { spike: { pos: { x: 2900, y: 1300 } } },
    ],
  };
}
