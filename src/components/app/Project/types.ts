export interface WarrantyFile {
  name: string;
  url: string;
  date: string;
  status: string;
}

export interface ProjectMember {
  memberID: number;
  name: string;
  avatar?: string | null | false;
  userID?: number;
}

export interface ProjectDetails {
  id: number;
  projectCode: string;
  projectStatusName: string;
  projectStatusColor: string;
  access_type_name: string;
  projectStartDate: string;
  projectFinishDate: string;
  projectStage: number;
  projectMaxStage: number;
  stagingSystemID: number;

  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;

  owner: {
    installerID: number;
    name: string;
    companyName: string;
    email: string;
    mobile: string;
    avatar?: string;
  };

  projectWarranty: {
    approved: {
      number: string;
      warrantyType: number;
      period: number;
      status: string;
      downloadURI?: string;
    }[];
    others: WarrantyFile[];
  } | null;

  deliveries: any[];
  projectMembers: ProjectMember[];
}
