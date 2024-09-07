export type LevelObject = {
  playerPos: { x: number; y: number };
  goalPos: { x: number; y: number };
  objects: MyGameObject[];
};

export type Box = {
  pos: { x: number; y: number };
  width: number;
  height: number;
};

export type MyGameObject = { box?: Box };
