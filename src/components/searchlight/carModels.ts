/** Most common makes and models on German roads (free, no API) – for quick picking. */
export const CAR_MODELS: Record<string, string[]> = {
  VW: ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc', 'Touran', 'Up!', 'T-Cross', 'Caddy', 'ID.3', 'ID.4', 'Arteon', 'Touareg', 'Sharan', 'Transporter'],
  Mercedes: ['A-Klasse', 'B-Klasse', 'C-Klasse', 'E-Klasse', 'GLA', 'GLB', 'GLC', 'GLE', 'CLA', 'S-Klasse', 'Vito', 'Sprinter'],
  BMW: ['1er', '2er', '3er', '4er', '5er', 'X1', 'X2', 'X3', 'X5', 'i3', 'i4', 'iX'],
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5', 'Q7', 'e-tron', 'Q4 e-tron'],
  Opel: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Zafira', 'Adam', 'Meriva', 'Vivaro'],
  Ford: ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Mondeo', 'EcoSport', 'C-Max', 'S-Max', 'Galaxy', 'Transit', 'Mustang Mach-E'],
  Skoda: ['Octavia', 'Fabia', 'Superb', 'Kodiaq', 'Karoq', 'Kamiq', 'Scala', 'Enyaq', 'Citigo'],
  Seat: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Alhambra'],
  Cupra: ['Born', 'Formentor', 'Leon', 'Ateca'],
  Toyota: ['Yaris', 'Corolla', 'C-HR', 'RAV4', 'Aygo', 'Auris', 'Prius', 'Yaris Cross'],
  Hyundai: ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Ioniq 5', 'Santa Fe', 'Bayon'],
  Kia: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Niro', 'Stonic', 'EV6', 'Sorento', 'XCeed'],
  Renault: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Scenic', 'Twingo', 'Zoe', 'Austral', 'Arkana'],
  Dacia: ['Sandero', 'Duster', 'Logan', 'Jogger', 'Spring'],
  Peugeot: ['208', '308', '2008', '3008', '5008', '508', 'Rifter'],
  Citroen: ['C3', 'C4', 'C5 Aircross', 'C3 Aircross', 'Berlingo'],
  Fiat: ['500', 'Panda', 'Tipo', '500X', 'Ducato', 'Doblo'],
  Mazda: ['Mazda2', 'Mazda3', 'CX-3', 'CX-30', 'CX-5', 'MX-5', 'Mazda6'],
  Nissan: ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
  Volvo: ['XC40', 'XC60', 'XC90', 'V40', 'V60', 'V90'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  Mini: ['Cooper', 'Countryman', 'Clubman'],
  Suzuki: ['Swift', 'Vitara', 'Ignis', 'S-Cross'],
  Honda: ['Jazz', 'Civic', 'CR-V', 'HR-V'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Taycan', 'Panamera'],
};

export const POPULAR_MAKES = ['VW', 'Mercedes', 'BMW', 'Audi', 'Opel', 'Ford', 'Skoda', 'Toyota', 'Hyundai', 'Seat', 'Renault', 'Kia'];
export const ALL_MAKES = Object.keys(CAR_MODELS).sort((a, b) => a.localeCompare(b, 'de'));

export const YEARS = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i));
