export type Activity = { label: string; count: number };
export type City = Activity & { country: string; point: [number, number] | null };
export type Traffic = {
  updatedAt: string;
  last30: number;
  last5: number;
  minutes: number[];
  cities: City[];
  pages: Activity[];
  acquisition: Activity[] | null;
};
