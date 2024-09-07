// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: { x: 0, y: 0 },
    goalPos: { x: 2550, y: 80 },
    objects: [
      // 1 floor
      { box: { pos: { x: -500, y: 160 }, width: 1000, height: 100 } },
      // moving platform between first and second floor
      {
        box: {
          pos: { x: 1000, y: 160 },
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: -1,
          },
        },
      },
      // 2 floor
      { box: { pos: { x: 2000, y: 160 }, width: 2000, height: 100 } },
    ],
  };
}
