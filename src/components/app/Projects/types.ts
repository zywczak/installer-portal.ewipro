export interface Member {
  installerID: string;
  name: string;
  avatar: string | null;
}

export interface Address {
  postcode: string;
  rest: string;
  full: string;
}

export type ProjectStatus = "Open" | "Closed";

export interface Project {
  id: string;
  contactID: string;
  projectCode: string;
  address: Address;
  stage: string;
  status: ProjectStatus;
  accessType: string;
  totalValue?: string;
  myValue?: string;
  isOwner: boolean;
  isWarranty: boolean;
  members: Member[];
}
