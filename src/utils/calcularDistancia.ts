// Calcula distancia entre dos coordenadas en metros.
export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {

  const R = 6371e3; // Radio de la tierra en metros, dato necesario para la formula Haversine.

  const toRad = (deg: number) => deg * Math.PI / 180; // Pasamos todos los grados a radianes para poder operarlos con la formula Haversine.

  const lat1Rad = toRad(lat1);
  const lon1Rad = toRad(lon1);
  const lat2Rad = toRad(lat2);
  const lon2Rad = toRad(lon2);

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) *
    Math.cos(lat2Rad) *
    Math.sin(dLon / 2) ** 2; // Se aplica la formula, este dato es el valor de qué tan separados están los dos puntos sobre la tierra.

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Este dato es el ángulo que hay entre los dos puntos sobre la tierra.


  return R * c; // Acá ya se tiene la distancia entre los dos puntos.
};