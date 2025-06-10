export interface Location {
  name: string; // can't find always airports only by IATA, therefore city and airport have only 'name
  country: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
}

export interface Airport extends Location {
  iata: string;
  icao?: string;
}
