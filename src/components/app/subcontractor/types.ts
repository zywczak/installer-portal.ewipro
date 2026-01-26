export interface SubcontractorInfo {
  name: string;
  email: string;
  mobile: string;
  companyName?: string;
  isRegistered: boolean;
}

export interface SubcontractorPermission {
  key: string;
  labelKey: string;
  descriptionKey: string;
  enabled: boolean;
}

export interface Project {
  id: string;
  contactID: string;
  projectCode: string;
  address: {
    postcode: string;
    rest: string;
    full: string;
  };
  stage: string;
  status: "Open" | "Closed";
  accessType: string;
  totalValue?: string;
  myValue?: string;
  isOwner: boolean;
  isWarranty: boolean;
  members: { installerID: string; name: string; avatar: string | null }[];
}

export interface SubcontractorProps {
  subcontractorId: string;
  onNameChange?: (name: string | null) => void;
}