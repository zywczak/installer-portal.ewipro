import React from "react";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "./ChatMessage.types";
import UserAvatar from "../UserAvatar";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isUserMessage: boolean;
  showDetails: boolean;
  alignWithAvatar?: boolean;
  ewiGreenDark: string;
  userName: string;
  theme: any;
  onImageClick?: (url: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  isUserMessage,
  showDetails,
  alignWithAvatar = false,
  ewiGreenDark,
  userName,
  theme,
  onImageClick,
}) => {
  const parseMessageDate = (msg: ChatMessage): string => {
    const candidates = [msg.stamp, msg.timestamp, msg.date];
    for (const c of candidates) {
      if (!c) continue;
      let date: Date | null = null;
      if (typeof c === "number") date = new Date(c.toString().length === 10 ? c * 1000 : c);
      if (typeof c === "string") {
        if (/^\d+$/.test(c)) date = new Date(c.length === 10 ? Number(c) * 1000 : Number(c));
        else date = new Date(c.replace(" ", "T"));
      }
      if (date && !isNaN(date.getTime())) {
        const today = new Date();
        const isToday =
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();
        return isToday
          ? date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
          : date.toLocaleDateString("pl-PL") +
              " " +
              date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
      }
    }
    return "";
  };

  const formattedTimestamp = parseMessageDate(message);
  const hasAvatar = showDetails && !!message.avatar;
  const avatarOffset = 48;

  const bubbleStyles = {
    maxWidth: "90%",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    fontSize: 14,
    position: "relative",
    px: 2,
    py: message.streaming ? 2 : 0,
    bgcolor: isUserMessage ? ewiGreenDark : "#eeeeee",
    color: isUserMessage ? "#fff" : "#000",
    borderRadius: isUserMessage ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
    ...(alignWithAvatar && !hasAvatar ? (isUserMessage ? { mr: `${avatarOffset}px` } : { ml: `${avatarOffset}px` }) : {}),
  };

  const detailsBox =
    showDetails && (userName || formattedTimestamp) ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 0.5,
          flexDirection: isUserMessage ? "row-reverse" : "row",
          color: theme.palette.text.primary,
        }}
      >
        {userName && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: isUserMessage ? "bold" : "normal",
              fontSize: 13,
              color: isUserMessage ? theme.palette.text.primary : ewiGreenDark,
            }}
          >
            {userName}
          </Typography>
        )}
        {formattedTimestamp && (
          <Typography variant="caption" sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
            {formattedTimestamp}
          </Typography>
        )}
      </Box>
    ) : null;

  const avatarComponent =
    showDetails && message.avatar ? (
      <UserAvatar
        avatarUrl={message.avatar}
        size={40}
        tooltip={userName}
      />
    ) : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: isUserMessage ? "flex-end" : "flex-start", mb: 0.5 }}>
      {detailsBox}
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", flexDirection: isUserMessage ? "row-reverse" : "row" }}>
        {avatarComponent}
        <Box sx={bubbleStyles}>
          {message.streaming ? (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end" }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    bgcolor: isUserMessage ? ewiGreenDark : theme.palette.text.primary,
                    display: "inline-block",
                    animation: `jump 1s infinite ${delay}s`,
                  }}
                />
              ))}
            </Box>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          )}
        </Box>
        {message.picture && (
          <Box sx={{ mt: 0.5 }}>
            <img
              src={message.picture}
              alt="attachment"
              style={{ maxWidth: 200, borderRadius: 8, cursor: onImageClick ? "pointer" : "default", boxShadow: "0px 6px 18px rgba(0,0,0,0.35)" }}
              onClick={() => onImageClick && onImageClick(message.picture!)}
            />
          </Box>
        )}
      </Box>
      <style>{`@keyframes jump { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>
    </Box>
  );
};
