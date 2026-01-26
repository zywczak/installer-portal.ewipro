  import React, { useState, useRef } from "react";
  import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
  import SendIcon from "@mui/icons-material/Send";
  import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
  import UserAvatar from "../UserAvatar";
  import EmojiPicker from "emoji-picker-react";
  import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

  interface ChatInputProps {
    onSendMessage: (payload: { text?: string; picture?: File }) => void;
    userAvatarUrl: string;
    sendIconColor?: string;
    inputPlaceholder?: string;
    showFileInput?: boolean;
    showIconsInput?: boolean;
  }

  export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    userAvatarUrl,
    sendIconColor = "#4CAF50",
    inputPlaceholder,
    showFileInput = false,
    showIconsInput = false,
  }) => {
    const [input, setInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSend = () => {
      if (!input.trim()) return;
      onSendMessage({ text: input.trim() });
      setInput("");
    };

    const handleAddPhotoClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      onSendMessage({ picture: file });
      e.target.value = "";
    };

    return (
      <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1, borderTop: "1px solid #BDBDBD", bgcolor: "background.paper", borderRadius: "0 0 12px 12px" }}>
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
                px: 2,
                fontSize: 14,
                bgcolor: "transparent",
              },
              "& textarea": { overflow: "hidden", height: "20px" },
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            slotProps={{
              input : {
              startAdornment: (showFileInput || showIconsInput) ? (
    <InputAdornment position="start">
      {showFileInput && (
        <IconButton onClick={handleAddPhotoClick} sx={{ color: sendIconColor }}>
          <PhotoCameraIcon />
        </IconButton>
      )}

      {showIconsInput && (
        <IconButton
          onClick={() => setShowEmojiPicker(v => !v)}
          sx={{ color: sendIconColor }}
        >
          <EmojiEmotionsIcon />
        </IconButton>
      )}
    </InputAdornment>
  ) : null,

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
          {showIconsInput && showEmojiPicker && (
    <Box sx={{ position: "absolute", bottom: 60, left: 10, zIndex: 10 }}>
      <EmojiPicker
        onEmojiClick={(emojiData) => {
          setInput(prev => prev + emojiData.emoji);
        }}
      />
    </Box>
  )}
        </Box>
      </Box>
    );
  };
