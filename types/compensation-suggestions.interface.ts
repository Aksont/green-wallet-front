import {
  Challenge,
  DonationProject,
  VolunteerProject,
} from "./project.interface";

export interface CompensationSuggestions {
  trees: number;
  volunteerHours: number;
  donationProjects: DonationProject[]; // show ids of projects that could go well for the offset/compensation based on locations
  volunteerProjects: VolunteerProject[];
  challenges: Challenge[]; // can't be used as PoC, but still can be additional things, and be put additionally in the PoC
}
