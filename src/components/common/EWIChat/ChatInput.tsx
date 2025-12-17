import React, { useState, useRef } from "react";
import { Box, TextField, IconButton, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserAvatar from "../UserAvatar";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  userAvatarUrl: string;
  sendIconColor?: string;
  inputPlaceholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  userAvatarUrl,
  sendIconColor = "#4CAF50",
  inputPlaceholder,
}) => {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleAddPhotoClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: upload -> onSendMessage({ content: "", picture: URL })
    e.target.value = "";
  };

  return (
    <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1, borderTop: "1px solid #BDBDBD", bgColor: "background.paper" }}>
      <UserAvatar avatarUrl={userAvatarUrl} size={44} tooltip="Your avatar" />
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", borderRadius: "28px", px: 1 }}>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        <IconButton onClick={handleAddPhotoClick} sx={{ color: sendIconColor }}>
          <PhotoCameraIcon />
        </IconButton>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": { backgroundColor: "transparent", borderRadius: "24px", px: 1, fontSize: 14 },
            "& textarea": { minHeight: "1em", overflow: "hidden" },
          }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <IconButton onClick={handleSend} disabled={!input.trim()} sx={{ color: sendIconColor }}>
          <SendIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      </Box>
    </Box>
  );
};
