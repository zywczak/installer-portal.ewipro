import React from "react";
import { Box } from "@mui/material";

interface StreamingDotsProps {
  isUserMessage: boolean;
  ewiGreenDark: string;
  theme: any;
}

export const StreamingDots: React.FC<StreamingDotsProps> = ({
  isUserMessage,
  ewiGreenDark,
  theme,
}) => (
  <>
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end" }}>
      {([0, 0.2, 0.4] as const).map((delay) => (
        <Box
          key={delay}
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
    <style>{`@keyframes jump { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>
  </>
);