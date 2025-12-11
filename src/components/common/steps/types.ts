export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string | null;
  invited: boolean;
}

export interface FormData {
  postCode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  occupierName: string;
  startDate: string;
  buildType: string;
  substrate: string;
  system: string;
  pasRole: string;
  warrantyProvider: string;
  warrantyPeriod: string;
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  companyName: string;
  ownershipRole: string;
  teamMembers: TeamMember[];
}

export interface LookupAddress {
  line_1: string;
  line_2?: string;
  town?: string;
  traditional_county?: string;
  udprn: string;
  postcode?: string;
}