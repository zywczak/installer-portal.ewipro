import React from "react";
import { Box } from "@mui/material";

interface AttachmentImageProps {
  picture: string;
  onImageClick?: (url: string) => void;
}

export const AttachmentImage: React.FC<AttachmentImageProps> = ({
  picture,
  onImageClick,
}) => (
  <Box sx={{ mt: 0.5 }} onClick={() => onImageClick?.(picture)}>
    <img
      src={picture}
      alt="attachment"
      style={{
        maxWidth: 200,
        borderRadius: 8,
        cursor: onImageClick ? "pointer" : "default",
        boxShadow: "0px 6px 18px rgba(0,0,0,0.35)",
      }}
    />
  </Box>
);