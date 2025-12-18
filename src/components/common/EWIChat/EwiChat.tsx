import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChatMessage } from "./ChatMessage.types";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatInput } from "./ChatInput";
import PhotoGallery from "../project/photoGallery/PhotoGallery";
import Header from "../Header";
import Ewi from "../../../assets/Ewi.svg";

interface EWIChatViewProps {
  title?: string;
  description?: string;
  status?: "connected" | "disconnected";
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose?: () => void;
  inputPlaceholder?: string;
  showStatus?: boolean;
  showDetails?: boolean;
  alignWithAvatar?: boolean;
  showCloseButton?: boolean;
}

export const EWIChatView: React.FC<EWIChatViewProps> = ({
  title = "EWI Chat",
  description = "",
  status = "disconnected",
  messages,
  onSendMessage,
  onClose,
  inputPlaceholder,
  showStatus = true,
  showDetails = true,
  alignWithAvatar = false,
  showCloseButton = true,
}) => {
  const theme = useTheme();
  const listRef = useRef<HTMLDivElement>(null);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<{ id: string; url: string }[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const userAvatarUrl = localStorage.getItem("userAvatar");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleImageClick = (clickedUrl: string) => {
    const allPhotos = messages.filter(m => m.picture).map((m, idx) => ({ id: `${m.id}-${idx}`, url: m.picture! }));
    const clickedIndex = allPhotos.findIndex(p => p.url === clickedUrl);
    setGalleryPhotos(allPhotos);
    setGalleryInitialIndex(clickedIndex >= 0 ? clickedIndex : 0);
    setGalleryOpen(true);
  };

  const headerActions = (
    <>
      {showStatus && (
        <Typography
          sx={{
            fontSize: 13,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 500,
            bgcolor: status === "connected" ? "rgba(22,163,74,0.2)" : "rgba(239,68,68,0.2)",
            color: status === "connected" ? "rgb(22,163,74)" : theme.palette.error.main,
          }}
        >
          {status === "connected" ? "Connected" : "Disconnected"}
        </Typography>
      )}
      {showCloseButton && onClose && (
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="medium" sx={{ color: "#333" }} />
        </IconButton>
      )}
    </>
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: "0 10px 30px rgba(2,6,23,.15)",
        border: "1px solid #e0e0e0"
      }}
    >
      <Box sx={{ px: 3, pt: 3 }}>
        <Header
          icon={Ewi && <img src={Ewi} alt="EWI" style={{ height: 36, opacity: 0.9 }} />}
          title={title}
          description={description}
          actions={headerActions}
        />
      </Box>

      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 4,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
            No messages yet. Start chatting below 👇
          </Typography>
        )}
        {messages.map((m) => (
          <ChatMessageBubble
            key={m.id}
            message={m}
            isUserMessage={m.isUserMessage ?? (m.role === "user")}
            showDetails={showDetails}
            alignWithAvatar={alignWithAvatar}
            ewiGreenDark="#4CAF50"
            userName={m.userName || ""}
            theme={theme}
            onImageClick={handleImageClick}
          />
        ))}
      </Box>

      <ChatInput
        onSendMessage={onSendMessage}
        userAvatarUrl={userAvatarUrl || ""}
        inputPlaceholder={inputPlaceholder}
      />

      <PhotoGallery
        photos={galleryPhotos}
        initialIndex={galleryInitialIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </Box>
  );
};

export default EWIChatView;
