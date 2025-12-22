import React from "react";
import { Button } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface HelpButtonProps {
  helpAvailable: boolean;
  onHelpClick: () => void;
}

const HelpButton: React.FC<HelpButtonProps> = ({ helpAvailable, onHelpClick }) => {
  if (!helpAvailable) return null;

  return (
    <Button
      onClick={onHelpClick}
      sx={{
        backgroundColor: "#437A8E",
        width: "202px",
        borderRadius: "999px",
        textTransform: "none",
        fontSize: "16px",
        forntWeight: 700,
        boxShadow: "none",
        color: "#fff",
      }}
      endIcon={
          <HelpOutlineIcon sx={{ fontSize: 20 }} />
      }
    >
      Open help
    </Button>
  );
};

export default HelpButton;
