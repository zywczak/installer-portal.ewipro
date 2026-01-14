export interface UserProfile {
  name?: string;
  avatar?: string | null;
  company_name?: string;
  phones?: {
    mobile?: string;
    phone?: string;
  };
}
