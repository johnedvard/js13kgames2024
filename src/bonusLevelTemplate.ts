// ⇧ ⇨ ⇩ ⇦ ⇖ ⇗ ⇘ ⇙
export default function getLevel() {
  return {
    playerPos: { x: 900, y: 500 },
    goalPos: { x: 280, y: 900 },
    objects: [
      // floor
      { box: { pos: { x: 200, y: 1240 }, width: 1200, height: 100 } },
      // left wall
      { box: { pos: { x: 100, y: 240 }, width: 100, height: 1000 } },
      // moving platform
      {
        box: {
          pos: { x: 500, y: 0 },
          width: 440,
          height: 100,
          options: {
            path: { x: 250, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: -1,
          },
        },
      },
      // right wall
      { box: { pos: { x: 1300, y: 240 }, width: 100, height: 1000 } },

      // left floor
      { box: { pos: { x: 200, y: 660 }, width: 430, height: 150 } },
      // right floor
      { box: { pos: { x: 870, y: 660 }, width: 430, height: 150 } },
    ],
  };
}

// ⇧ ⇨ ⇩ ⇦ ⇖ ⇗ ⇘ ⇙
// export default function getLevel() {
//   return {
//     playerPos: { x: 0, y: 0 },
//     goalPos: { x: -500, y: -780 },
//     objects: [
//       // floor
//       { box: { pos: { x: -1500, y: 150 }, width: 2000, height: 100 } },
//       // moving platform
//       {
//         box: {
//           pos: { x: -250, y: -450 },
//           width: 440,
//           height: 100,
//           options: {
//             path: { x: 250, y: 0 },
//             speed: { x: 1.5, y: 0 },
//             direction: -1,
//           },
//         },
//       },
//       // right wall
//       { box: { pos: { x: 500, y: -450 }, width: 250, height: 700 } },
//       { spike: { pos: { x: -1200, y: 0 } } },
//       { spike: { pos: { x: 550, y: -550 } } },
//       { text: { pos: { x: 510, y: 50 }, text: "⇖ Behind you ⇖" } },
//     ],
//   };
// }
