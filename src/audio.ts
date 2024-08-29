import { zzfx, zzfxX, zzfxP } from "./ZzFX";
import { zzfxM } from "./ZzFXM.js";

let audioContext = zzfxX;
let myAudioNode: any = null;
let timeSinceLastPlayerBubble = Date.now();
let timeSinceLastPlayInflate = Date.now();

export function playSingleBubble() {
  if (timeSinceLastPlayerBubble + 50 > Date.now()) return;
  timeSinceLastPlayerBubble = Date.now();
  zzfx(
    ...[, 1, 7, 0.02, 0.01, 0.02, 4, 0.5, , , 1, 0.01, , , 150, , 0.21, , 0.01]
  );
}
export function playInflate() {
  if (timeSinceLastPlayInflate + 150 > Date.now()) return;
  timeSinceLastPlayInflate = Date.now();
  zzfx(
    ...[
      0.2,
      ,
      513,
      ,
      ,
      0.01,
      ,
      0.5,
      ,
      ,
      -275,
      0.08,
      ,
      ,
      ,
      ,
      0.15,
      0.87,
      0.07,
      ,
      141,
    ]
  ); // Random 211
}
export function playthap() {
  zzfx(
    ...[
      0.4,
      ,
      23,
      ,
      0.21,
      0.02,
      4,
      3.1,
      ,
      26,
      ,
      ,
      ,
      ,
      75,
      ,
      0.43,
      0.81,
      0.01,
      0.46,
      -690,
    ]
  ); // Random 130
}
export function playBubble() {
  let playedTimes = 0;
  const timeout = setInterval(() => {
    playedTimes++;
    if (playedTimes > 8) clearInterval(timeout);
    playSingleBubble();
  }, 150);
}
export function playSong() {
  if (myAudioNode) {
    audioContext.resume();
    return;
  }
  let mySongData = zzfxM(...song);
  myAudioNode = zzfxP(zzfxX, ...mySongData);
  myAudioNode.loop = true;

  myAudioNode.loop = true;
}
// Need to manually add 220 as frequency (maybe becaue it's te default)
const song = [
  [
    [2, 0, 220, , 1.12, 0.33, , 1.2, , , , , , , 0.1, , , 0.55, 0.01],
    [, 0, 110, , 0.52, 0.9, , 0.4, , , , , , , 0.1, , , 0.32, 0.07, , -1045],
  ],
  [
    [
      [
        ,
        -1,
        ,
        ,
        ,
        ,
        ,
        ,
        10,
        ,
        ,
        ,
        12,
        ,
        ,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        27,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        10,
        ,
        ,
        ,
        12,
        ,
        ,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        27,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
      ],
      [
        1,
        1,
        8,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        8,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        6,
        ,
        13,
        ,
        18,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        6,
        ,
        13,
        ,
        18,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
      ],
    ],
    [
      [
        ,
        -1,
        ,
        ,
        ,
        ,
        ,
        ,
        10,
        ,
        ,
        ,
        11,
        ,
        ,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        27,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        10,
        ,
        ,
        ,
        13,
        ,
        ,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        27,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
      ],
      [
        1,
        1,
        4,
        ,
        11,
        ,
        16,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        4,
        ,
        11,
        ,
        16,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        6,
        ,
        13,
        ,
        18,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        6,
        ,
        13,
        ,
        18,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        13,
        ,
        ,
        ,
      ],
    ],
    [
      [
        ,
        -1,
        ,
        ,
        13,
        ,
        20,
        ,
        22,
        ,
        24,
        ,
        25,
        ,
        24,
        ,
        22,
        ,
        20,
        ,
        ,
        ,
        15,
        ,
        ,
        ,
        13,
        ,
        ,
        ,
        20,
        ,
        ,
        ,
        15,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        13,
        ,
        ,
        ,
        13,
        ,
        ,
        ,
        ,
        ,
        12,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        15,
        ,
        ,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
      ],
      [
        1,
        1,
        8,
        ,
        15,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        17,
        ,
        12,
        ,
        6,
        ,
        13,
        ,
        18,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        4,
        ,
        11,
        ,
        16,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        16,
        ,
        20,
        ,
        6,
        ,
        13,
        ,
        18,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        13,
        ,
        18,
        ,
        8,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        22,
        ,
        ,
        ,
        20,
        ,
        8,
        ,
        15,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
      ],
    ],
    [
      [
        ,
        -1,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        29,
        ,
        27,
        ,
        25,
        ,
        29,
        ,
        27,
        ,
        ,
        ,
        ,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        27,
        ,
        25,
        ,
        24,
        ,
        25,
        ,
        24,
        ,
        ,
        ,
        ,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        29,
        ,
        27,
        ,
        25,
        ,
        29,
        ,
        27,
        ,
        ,
        ,
        ,
        ,
        20,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        25,
        ,
        27,
        ,
        25,
        ,
        24,
        ,
        ,
        ,
        ,
        ,
        20,
        ,
        ,
        ,
        17,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
      ],
      [
        1,
        1,
        25,
        ,
        32,
        ,
        25,
        ,
        32,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        24,
        ,
        31,
        ,
        24,
        ,
        32,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        22,
        ,
        27,
        ,
        34,
        ,
        36,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        20,
        ,
        27,
        ,
        32,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        25,
        ,
        32,
        ,
        25,
        ,
        32,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        24,
        ,
        31,
        ,
        36,
        ,
        32,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        21,
        ,
        32,
        ,
        35,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        35,
        ,
        22,
        ,
        34,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        27,
        ,
        34,
        ,
        ,
        ,
      ],
    ],
  ],
  [0, 0, 1, 2, 2, 3, 2],
  138,
  {
    title: "B",
    instruments: ["m", "b"],
    patterns: ["Pattern 0", "Pattern 1", "Pattern 2", "Pattern 3"],
  },
];
