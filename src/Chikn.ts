type TraitType =
  | "head"
  | "neck"
  | "torso"
  | "body"
  | "feet"
  | "background"
  | "trim";

type ChiknMetadata = {
  attributes: { trait_type: TraitType; value: string }[];
  description: string;
  image: string;
  name: string;
};
export interface Chikn {
  id: number;
  metadata: ChiknMetadata;
  owner: any;
  tokenURI: string;
}
