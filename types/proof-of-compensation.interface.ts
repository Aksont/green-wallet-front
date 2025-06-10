export interface ProofOfCompensation {
  tripId: string;
  userId: string;
  trees: number;
  volunteerHours: number;
  donationInfos: CompensationInfo[];
  volunteeringInfos: CompensationInfo[];
  comment: string;
  status: string;
}

export interface CompensationInfo {
  id: string;
  tripId: string;
  projectId: string;
  date: Date;
  donation?: {
    trees: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
  };
  volunteering?: {
    hours: number;
  };
  compensatedCo2: number;
  remainingCo2Compensation: number;
}
