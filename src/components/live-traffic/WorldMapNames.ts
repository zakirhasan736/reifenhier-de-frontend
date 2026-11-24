// Analytics sends English city names; show the German ones
const DE_NAMES: Record<string, string> = {
  Munich: 'München', Cologne: 'Köln', Nuremberg: 'Nürnberg', Vienna: 'Wien', Zurich: 'Zürich', Geneva: 'Genf', Brunswick: 'Braunschweig',
  Hanover: 'Hannover', 'Frankfurt': 'Frankfurt am Main', Dusseldorf: 'Düsseldorf', Duesseldorf: 'Düsseldorf', Moenchengladbach: 'Mönchengladbach',
  Wurzburg: 'Würzburg', Osnabruck: 'Osnabrück', Saarbrucken: 'Saarbrücken', Gottingen: 'Göttingen', Lubeck: 'Lübeck', Munster: 'Münster',
  Tubingen: 'Tübingen', Furth: 'Fürth', Luneburg: 'Lüneburg', Prague: 'Prag', Warsaw: 'Warschau', Copenhagen: 'Kopenhagen', Brussels: 'Brüssel',
  Rome: 'Rom', Milan: 'Mailand', Venice: 'Venedig', Lisbon: 'Lissabon', Moscow: 'Moskau', Athens: 'Athen', Bucharest: 'Bukarest', Belgrade: 'Belgrad',
  Basel: 'Basel', Salzburg: 'Salzburg', 'The Hague': 'Den Haag', Luxembourg: 'Luxemburg', Strasbourg: 'Straßburg',
};
export const germanCity = (name: string) => DE_NAMES[name] || name;
