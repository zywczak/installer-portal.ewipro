export interface EWIProBoardProps {
  projectId: string;
}

export type ConnectionStatus = "connected" | "disconnected";

export interface ApiMessage {
  messageID: string;
  type: "message" | "picture";
  content: string | string[];
  pictureURI?: string;
  userID: number;
  authorName: string;
  icon?: string;
  iconPhoto?: boolean;
  stamp?: string;
  date?: string;
  dateLabel?: string;
}
