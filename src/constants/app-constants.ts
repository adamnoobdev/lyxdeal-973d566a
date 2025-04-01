
export const CITIES = [
  "Alla Städer",
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Linköping",
  "Västerås",
  "Örebro",
  "Helsingborg",
  "Norrköping",
  "Jönköping",
  "Umeå",
  "Lund",
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
  "Tandvård",
  "Ögonfransar & Bryn",
  "Kroppsvård",
  "Ansiktsbehandling",
  "Makeup",
  "Spa",
] as const;

export type City = (typeof CITIES)[number];
export type Category = (typeof CATEGORIES)[number];
