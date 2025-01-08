export const CITIES = [
  "Alla Städer",
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Linköping",
] as const;

export const CATEGORIES = [
  "Alla Erbjudanden",
  "Laserhårborttagning",
  "Fillers",
  "Rynkbehandlingar",
  "Hudvård",
  "Hårvård",
  "Naglar",
  "Massage",
] as const;

export type City = (typeof CITIES)[number];
export type Category = (typeof CATEGORIES)[number];