export interface Project {
  id: string;
  type: string;
  title: string;
  description: string;
  country: string;
  coordinates: string;
  cause: string;
  tags: string[]; // max 5 length
  startDate?: Date;
  endDate?: Date;
  image: string; // TODO url or blob still not sure
}

export interface DonationProject extends Project {
  unitPrice: number; // usually 1 tree
  currency: string;
}

export interface VolunteerProject extends Project {
  joinType: string;
}

export interface Challenge extends Project {
  challengeSteps: string;
  reward?: string;
}
