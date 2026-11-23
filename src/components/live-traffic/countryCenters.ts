/** Approximate country centers. Used when Analytics has a country but no city. */
export const COUNTRY_CENTERS: Record<string, { name: string; point: [number, number] }> = {
  AD: { name: 'Andorra', point: [42.5, 1.5] },
  AE: { name: 'United Arab Emirates', point: [24.0, 54.0] },
  AT: { name: 'Austria', point: [47.6, 14.1] },
  AU: { name: 'Australia', point: [-25.3, 133.8] },
  BD: { name: 'Bangladesh', point: [23.7, 90.4] },
  BE: { name: 'Belgium', point: [50.5, 4.5] },
  BG: { name: 'Bulgaria', point: [42.7, 25.5] },
  BR: { name: 'Brazil', point: [-14.2, -51.9] },
  CA: { name: 'Canada', point: [56.1, -106.3] },
  CH: { name: 'Switzerland', point: [46.8, 8.2] },
  CN: { name: 'China', point: [35.9, 104.2] },
  CZ: { name: 'Czechia', point: [49.8, 15.5] },
  DE: { name: 'Germany', point: [51.2, 10.4] },
  DK: { name: 'Denmark', point: [56.2, 9.5] },
  EG: { name: 'Egypt', point: [26.8, 30.8] },
  ES: { name: 'Spain', point: [40.5, -3.7] },
  FI: { name: 'Finland', point: [61.9, 25.7] },
  FR: { name: 'France', point: [46.2, 2.2] },
  GB: { name: 'United Kingdom', point: [54.0, -2.5] },
  GR: { name: 'Greece', point: [39.1, 21.8] },
  HK: { name: 'Hong Kong', point: [22.3, 114.2] },
  HR: { name: 'Croatia', point: [45.1, 15.2] },
  HU: { name: 'Hungary', point: [47.2, 19.5] },
  ID: { name: 'Indonesia', point: [-0.8, 113.9] },
  IE: { name: 'Ireland', point: [53.1, -8.0] },
  IL: { name: 'Israel', point: [31.0, 34.9] },
  IN: { name: 'India', point: [20.6, 79.0] },
  IT: { name: 'Italy', point: [41.9, 12.6] },
  JP: { name: 'Japan', point: [36.2, 138.3] },
  KR: { name: 'South Korea', point: [35.9, 127.8] },
  LU: { name: 'Luxembourg', point: [49.8, 6.1] },
  MA: { name: 'Morocco', point: [31.8, -7.1] },
  MX: { name: 'Mexico', point: [23.6, -102.6] },
  NL: { name: 'Netherlands', point: [52.1, 5.3] },
  NO: { name: 'Norway', point: [60.5, 8.5] },
  PL: { name: 'Poland', point: [51.9, 19.1] },
  PT: { name: 'Portugal', point: [39.4, -8.2] },
  RO: { name: 'Romania', point: [45.9, 25.0] },
  RS: { name: 'Serbia', point: [44.0, 21.0] },
  RU: { name: 'Russia', point: [61.5, 105.3] },
  SA: { name: 'Saudi Arabia', point: [23.9, 45.1] },
  SE: { name: 'Sweden', point: [60.1, 18.6] },
  SG: { name: 'Singapore', point: [1.35, 103.8] },
  SI: { name: 'Slovenia', point: [46.1, 14.8] },
  SK: { name: 'Slovakia', point: [48.7, 19.7] },
  TH: { name: 'Thailand', point: [15.9, 100.9] },
  TR: { name: 'Turkey', point: [39.0, 35.2] },
  UA: { name: 'Ukraine', point: [48.4, 31.2] },
  US: { name: 'United States', point: [37.1, -95.7] },
  VN: { name: 'Vietnam', point: [14.1, 108.3] },
  ZA: { name: 'South Africa', point: [-30.6, 22.9] },
}

/** City name when Analytics sent one, otherwise the English country name. */
export function placeLabel(country: string, label?: string | null, point?: [number, number] | null) {
  const center = countryCenter(country)
  const text = (label || '').trim()
  const onCountry = !point || (center != null && Math.abs(point[0] - center.point[0]) < 0.3 && Math.abs(point[1] - center.point[1]) < 0.3)
  if (!text || onCountry) return center?.name || text || country
  return text
}

export function countryCenter(code: string) {
  return COUNTRY_CENTERS[String(code || '').toUpperCase()] || null
}
