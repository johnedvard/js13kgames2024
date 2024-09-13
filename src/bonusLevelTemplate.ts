export default function getLevel() {
  return {
    playerPos: { x: 500, y: 1300 },
    goalPos: { x: 750, y: 720 },
    objects: [
      // floor
      { box: { pos: { x: 300, y: 1500 }, width: 1000, height: 150 } },
      // right wall
      { box: { pos: { x: 1200, y: 260 }, width: 350, height: 1350 } },
      // first plate
      { box: { pos: { x: 580, y: 1160 }, width: 450, height: 50 } },
      // second plate
      { box: { pos: { x: 580, y: 890 }, width: 450, height: 50 } },
    ],
  };
}
