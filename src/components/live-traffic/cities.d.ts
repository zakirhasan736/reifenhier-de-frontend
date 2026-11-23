declare module 'all-the-cities' {
  const cities: { country: string; name: string; loc: { coordinates: [number, number] } }[];
  export default cities;
}
