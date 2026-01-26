import { ChatMessage } from "./ChatMessage.types";

export const parseDateCandidate = (candidate: string | number | undefined): Date | null => {
  if (candidate == null) return null;

  if (typeof candidate === "number") {
    return new Date(candidate.toString().length === 10 ? candidate * 1000 : candidate);
  }

  if (typeof candidate === "string") {
    if (/^\d+$/.test(candidate)) {
      const num = Number(candidate);
      return new Date(candidate.length === 10 ? num * 1000 : num);
    }
    return new Date(candidate.replace(" ", "T"));
  }

  return null;
};

export const formatDate = (date: Date): string => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const time = date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return time;

  const day = date.toLocaleDateString("pl-PL");
  return `${day} ${time}`;
};

export const parseMessageDate = (msg: ChatMessage): string => {
  const candidates = [msg.stamp, msg.timestamp, msg.date];

  for (const candidate of candidates) {
    const date = parseDateCandidate(candidate);
    if (date && !Number.isNaN(date.getTime())) {
      return formatDate(date);
    }
  }

  return "";
};

export const getAvatarMargin = (alignWithAvatar: boolean, hasAvatar: boolean, isUserMessage: boolean) => {
  if (!alignWithAvatar || hasAvatar) return {};
  
  const avatarOffset = 48;
  return isUserMessage ? { mr: `${avatarOffset}px` } : { ml: `${avatarOffset}px` };
};

export const getBubbleStyles = (
  isUserMessage: boolean,
  streaming: boolean,
  ewiGreenDark: string,
  avatarMargin: object
) => ({
  maxWidth: "90%",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  fontSize: 14,
  position: "relative",
  px: 2,
  py: streaming ? 2 : 0,
  bgcolor: isUserMessage ? ewiGreenDark : "#eeeeee",
  color: isUserMessage ? "#fff" : "#000",
  borderRadius: isUserMessage ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
  ...avatarMargin,
});