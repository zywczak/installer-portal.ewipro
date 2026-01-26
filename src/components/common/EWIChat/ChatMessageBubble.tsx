import React from "react";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "./ChatMessage.types";
import UserAvatar from "../UserAvatar";
import { DetailsBox } from "./DetailsBox";
import { StreamingDots } from "./StreamingDots";
import { AttachmentImage } from "./AttachmentImage";
import { parseMessageDate, getAvatarMargin, getBubbleStyles } from "./ChatMessageBubble.helpers";

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
  const formattedTimestamp = parseMessageDate(message);
  const hasAvatar = showDetails && !!message.avatar;
  const avatarMargin = getAvatarMargin(alignWithAvatar, hasAvatar, isUserMessage);
  const bubbleStyles = getBubbleStyles(isUserMessage, !!message.streaming, ewiGreenDark, avatarMargin);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUserMessage ? "flex-end" : "flex-start",
        mb: 0.5,
      }}
    >
      <DetailsBox
        showDetails={showDetails}
        userName={userName}
        formattedTimestamp={formattedTimestamp}
        isUserMessage={isUserMessage}
        ewiGreenDark={ewiGreenDark}
        theme={theme}
      />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          flexDirection: isUserMessage ? "row-reverse" : "row",
        }}
      >
        {showDetails && message.avatar && (
          <UserAvatar avatarUrl={message.avatar} size={40} tooltip={userName} />
        )}
        <Box sx={bubbleStyles}>
          {message.streaming ? (
            <StreamingDots isUserMessage={isUserMessage} ewiGreenDark={ewiGreenDark} theme={theme} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          )}
        </Box>
        {message.picture && <AttachmentImage picture={message.picture} onImageClick={onImageClick} />}
      </Box>
    </Box>
  );
};