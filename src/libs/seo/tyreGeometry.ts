export type SizeInput = { width: number; height: number; diameter: number };

/** Nominal geometry from a size like 205/55 R16 (all values in mm). */
export function tyreGeometry({ width, height, diameter }: SizeInput) {
  const sidewall = (width * height) / 100;
  const rim = diameter * 25.4;
  const outer = rim + 2 * sidewall;
  const circumference = Math.PI * outer;
  return { sidewall, rim, outer, circumference, revsPerKm: 1_000_000 / circumference };
}
