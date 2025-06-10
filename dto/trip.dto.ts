import { SequenceDto } from "./sequence.dto";

export interface TripDto {
  title: string;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  sequences: SequenceDto[];
  returnSequences?: SequenceDto[];
}
