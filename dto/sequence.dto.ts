export interface SequenceDto {
  from: string;
  to: string;
  date: string;
  transportType: string;
  numOfPassangers?: number; // TODO only for cars, validate that it does not exist for other types, validate value in between 1 and 7
  distance?: number; // TODO only for walking/biking, validate that it does not exist for other types, should be implemented with strava but
}
