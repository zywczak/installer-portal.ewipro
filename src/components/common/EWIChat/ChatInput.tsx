import React, { useState, useRef } from "react";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
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
    /// add upload -> onSendMessage({ content: "", picture: URL })
    e.target.value = "";
  };

  return (
    <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1, borderTop: "1px solid #BDBDBD", bgcolor: "background.paper" }}>
      <UserAvatar avatarUrl={userAvatarUrl} size={44} tooltip="Your avatar" />
      <Box sx={{ flexGrow: 1 }}>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "28px",
              px: 1,
              fontSize: 14,
              bgcolor: "transparent",
            },
            "& textarea": { overflow: "hidden", height: "20px" },
          }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          slotProps={{
            input : {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleAddPhotoClick} sx={{ color: sendIconColor }}>
                  <PhotoCameraIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSend} disabled={!input.trim()} sx={{ color: sendIconColor }}>
                  <SendIcon sx={{ fontSize: "26px" }} />
                </IconButton>
              </InputAdornment>
            ),
          },
          }}
        />
      </Box>
    </Box>
  );
};
