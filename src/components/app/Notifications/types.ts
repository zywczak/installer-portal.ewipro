export interface Notification {
  id: number;
  date: string;
  slug: string;
  projectID?: number;
  contactID?: number;
  title: string;
  message: string;
  time?: string;
  read?: boolean;
}