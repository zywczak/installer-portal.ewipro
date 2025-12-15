export interface Permission {
  id: number;
  slug: string;
  name: string;
  description: string;
  type: string;
  value: boolean;
  selectOptions: any;
  testOnly: boolean;
}

export type UserStatus = "verified" | "not_registered" | "invited";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: UserStatus;
  role: string;
  roleColor?: string;
  avatar?: string | false;
  invited: boolean;
  permissions: Permission[];
  raw?: any;
}
