import React from "react";
import { Box, Typography } from "@mui/material";

interface DetailsBoxProps {
  showDetails: boolean;
  userName: string;
  formattedTimestamp: string;
  isUserMessage: boolean;
  ewiGreenDark: string;
  theme: any;
}

export const DetailsBox: React.FC<DetailsBoxProps> = ({
  showDetails,
  userName,
  formattedTimestamp,
  isUserMessage,
  ewiGreenDark,
  theme,
}) => {
  if (!showDetails || (!userName && !formattedTimestamp)) return null;

  return (
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
  );
};