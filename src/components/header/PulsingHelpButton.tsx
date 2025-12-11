import React from "react";
import { IconButton, Box, useTheme } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface PulsingHelpButtonProps {
  clicked?: boolean;
  onClick?: () => void;
}

const PulsingHelpButton: React.FC<PulsingHelpButtonProps> = ({
  clicked = false,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{ 
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!clicked && (
        <Box
          sx={{
            position: "absolute",
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#f48fb1",
            animation: "pulse 3s ease-out infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(0.5)", opacity: 1 },
              "70%": { transform: "scale(1)", opacity: 0 },
              "100%": { transform: "scale(0.5)", opacity: 0 },
            },
          }}
        />
      )}

      <IconButton
        onClick={onClick}
        sx={{
          zIndex: 1,
        }}
      >
        <HelpOutlineIcon sx={{ color: theme.palette.secondary.main }} />
      </IconButton>
    </Box>
  );
};

export default PulsingHelpButton;
