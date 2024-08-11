export type StoneColor = "D" | "E" | "F" | "G";
export type StoneClarity = "VS1" | "VS2" | "VVS1" | "VVS2";
export interface StoneSpecifications {
  color: StoneColor;
  clarity: StoneClarity;
  carat: string;
}
export interface MetaObjectUrl {
  text: string;
  url: string;
}
