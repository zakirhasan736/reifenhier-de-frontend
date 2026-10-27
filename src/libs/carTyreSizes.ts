/**
 * Common factory tyre sizes for popular cars in Germany.
 *
 * Sizes vary by engine, trim and rim option — this list gives the most
 * common series sizes as a starting point. The calculator always tells the
 * user to confirm against the Zulassungsbescheinigung Teil I / CoC paper.
 * Size/model pairs for 185/65 R15 and 225/50 R17 follow the vehicle lists
 * in ADAC's 2026 winter tyre test.
 */
export type CarModel = { model: string; sizes: string[] };
export type CarMake = { make: string; models: CarModel[] };

export const CAR_TYRE_SIZES: CarMake[] = [
  {
    make: 'Audi',
    models: [
      { model: 'A1', sizes: ['185/65 R15', '195/55 R16'] },
      { model: 'A3', sizes: ['205/55 R16', '225/45 R17'] },
      { model: 'A4', sizes: ['225/50 R17', '245/40 R18'] },
    ],
  },
  {
    make: 'BMW',
    models: [
      { model: '1er', sizes: ['205/55 R16', '225/45 R17'] },
      { model: '3er', sizes: ['225/50 R17', '225/45 R18'] },
    ],
  },
  {
    make: 'Dacia',
    models: [{ model: 'Sandero', sizes: ['185/65 R15'] }],
  },
  {
    make: 'Ford',
    models: [
      { model: 'Fiesta', sizes: ['195/55 R16'] },
      { model: 'Focus', sizes: ['205/60 R16', '215/50 R17'] },
      { model: 'Kuga', sizes: ['225/65 R17', '225/60 R18'] },
    ],
  },
  {
    make: 'Hyundai',
    models: [{ model: 'i30', sizes: ['205/55 R16', '225/45 R17'] }],
  },
  {
    make: 'Kia',
    models: [
      { model: 'Ceed', sizes: ['205/55 R16', '225/45 R17'] },
      { model: 'Stonic', sizes: ['185/65 R15', '205/55 R17'] },
    ],
  },
  {
    make: 'Mercedes-Benz',
    models: [
      { model: 'A-Klasse', sizes: ['205/60 R16', '205/55 R17'] },
      { model: 'C-Klasse', sizes: ['225/50 R17', '225/45 R18'] },
    ],
  },
  {
    make: 'Opel',
    models: [
      { model: 'Corsa', sizes: ['185/65 R15', '195/55 R16'] },
      { model: 'Astra', sizes: ['205/55 R16', '225/45 R17'] },
    ],
  },
  {
    make: 'Peugeot',
    models: [{ model: '208', sizes: ['185/65 R15', '195/55 R16'] }],
  },
  {
    make: 'Renault',
    models: [{ model: 'Clio', sizes: ['185/65 R15', '195/55 R16'] }],
  },
  {
    make: 'Seat',
    models: [
      { model: 'Ibiza', sizes: ['185/65 R15', '195/55 R16'] },
      { model: 'Leon', sizes: ['205/55 R16', '225/45 R17'] },
    ],
  },
  {
    make: 'Skoda',
    models: [
      { model: 'Fabia', sizes: ['185/65 R15'] },
      { model: 'Octavia', sizes: ['205/55 R16', '225/45 R17'] },
      { model: 'Superb', sizes: ['215/55 R17', '235/45 R18'] },
      { model: 'Kodiaq', sizes: ['215/65 R17', '235/55 R18'] },
    ],
  },
  {
    make: 'Tesla',
    models: [{ model: 'Model 3', sizes: ['235/45 R18'] }],
  },
  {
    make: 'Toyota',
    models: [
      { model: 'Yaris', sizes: ['185/65 R15'] },
      { model: 'Corolla', sizes: ['205/55 R16', '225/45 R17'] },
    ],
  },
  {
    make: 'VW',
    models: [
      { model: 'Polo', sizes: ['185/65 R15', '195/55 R16'] },
      { model: 'Golf', sizes: ['205/55 R16', '225/45 R17'] },
      { model: 'T-Roc', sizes: ['215/60 R16', '215/55 R17'] },
      { model: 'Passat', sizes: ['215/60 R16', '215/55 R17'] },
      { model: 'Tiguan', sizes: ['215/65 R17', '235/55 R18'] },
    ],
  },
];

export function parseSizeLabel(label: string) {
  const m = label.match(/(\d{3})\/(\d{2})\s*R(\d{2})/i);
  return m ? { width: m[1], height: m[2], diameter: m[3] } : null;
}
