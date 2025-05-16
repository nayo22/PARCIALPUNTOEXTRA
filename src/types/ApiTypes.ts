export interface Plants {
  id?: number;
  common_name: string;
  scientific_name: string;
  img: string;
  type: string;
  origin: string;
  flowering_season: string;
  sun_exposure: string;
  watering: string;

  // Alias 
  commonName?: string;
  scientificName?: string;
  floweringSeason?: string;
  sunExposure?: string;
}
