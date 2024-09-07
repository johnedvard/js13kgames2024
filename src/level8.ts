// ⇧ ⇨ ⇩ ⇦
// 1 moving platform
export default function getLevel() {
  return {
    playerPos: { x: -200, y: -150 },
    goalPos: { x: 1850, y: -25 },
    objects: [
      // 1 moving platform
      {
        box: {
          pos: { x: -200, y: 50 },
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: -1,
          },
        },
      },
      // second moving platform (above)
      {
        box: {
          pos: { x: 600, y: -600 },
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: 1,
          },
        },
      },
      // third moving platform
      {
        box: {
          pos: { x: 1500, y: 50 },
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: -1,
          },
        },
      },
    ],
  };
}
