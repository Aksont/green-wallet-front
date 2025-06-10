import { TransportType } from "@/enums/transport-type.enum";
import { Location, Airport } from "./location.interface";

export interface Sequence {
  from: Location | Airport;
  to: Location | Airport;
  date?: Date;
  transportType: TransportType;
  distanceInKm: number;
  co2emissionInKg: number;
  numOfPassangers?: number; // only used for car travel
}
