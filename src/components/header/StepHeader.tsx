import React from "react";
import { Box, Typography } from "@mui/material";
import PulsingHelpButton from "./PulsingHelpButton";
import EwiproLogo from "../../assets/EWI-Pro-Render-Systems.png";

interface StepHeaderProps {
  stepName: string;
  helpAvailable: boolean;
  helpClicked: boolean;
  onHelpClick: () => void;
  isMobile?: boolean;
}

const StepHeader: React.FC<StepHeaderProps> = ({ 
  stepName, 
  helpAvailable, 
  helpClicked, 
  onHelpClick,
  isMobile = false 
}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
      <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
        {helpAvailable && (
          <Box sx={{ ml: 1 }}>
            <PulsingHelpButton clicked={helpClicked} onClick={onHelpClick} />
          </Box>
        )}
        <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "16px"}>
          {stepName}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <img 
          src={EwiproLogo} 
          alt="Ewipro Logo" 
          style={{ height: isMobile ? "30px" : "40px" }} 
        />
      </Box>
    </Box>
  );
};

export default StepHeader;