type TraitType = "r" | "g" | "b";

type BubbleMetadata = {
  attributes: { trait_type: TraitType; value: string }[];
  description: string;
  image: string;
  name: string;
};
export interface Bubble {
  id: number;
  metadata: BubbleMetadata;
  owner: any;
  tokenURI: string;
}
