export type Character = {
  id: number;
  name: string;
  img: string;
  race: "Human" | "Demon" | string;
  age?: string | number | null;
  gender?: string | null;
  description?: string | null;
  quote?: string | null;
};
