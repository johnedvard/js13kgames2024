import { Vector } from "kontra";

export type LevelObject = {
  playerPos: Vector;
  goalPos: Vector;
  objects: MyGameObject[];
};

export type Box = {
  pos: Vector;
  width: number;
  height: number;
};

export type MyGameObject = { box?: Box };
