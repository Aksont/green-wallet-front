import { Sequence } from "./sequence.interface";
import { Location } from "./location.interface";

export interface Trip {
  id: string;
  title: string;
  from: Location;
  to: Location;
  startDate: Date;
  endDate: Date;
  sequences: Sequence[];
  returnSequences?: Sequence[];
  totalDistanceInKm: number;
  totalCo2emissionInKg: number;
}
