import { SequenceDto } from "@/dto/sequence.dto";

export const isSegmentValid = (segment: SequenceDto): boolean => {
  return (
    !!segment.from?.trim() && !!segment.to?.trim() && !!segment.transportType
  );
};

export const isSegmentDateValid = (
  segmentDate: string,
  tripStartDate: string,
  tripEndDate: string,
  prevSegmentDate?: string
): boolean => {
  if (!segmentDate) return true;

  if (
    !!tripStartDate &&
    !!tripEndDate &&
    (segmentDate < tripStartDate || segmentDate > tripEndDate)
  )
    return false;

  if (prevSegmentDate && segmentDate < prevSegmentDate) return false;

  return true;
};
