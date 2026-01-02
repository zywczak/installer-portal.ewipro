import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import HelpButton from "./helpButton";
import EwiproLogo from "../../../assets/EWI-Pro-Render-Systems.png";

interface StepHeaderProps {
  stepName: string | null;
  stepIndex?: number;
  maxSteps?: number;
  helpAvailable: boolean;
  onHelpClick: () => void;
  isMobile?: boolean;
}

const StepHeader: React.FC<StepHeaderProps> = ({
  stepName,
  stepIndex,
  maxSteps,
  helpAvailable,
  onHelpClick,
  isMobile = false,
}) => {
  return (
    <Box
      sx={{
        px: "24px",
        width: isMobile ? null : "212px",
        height: isMobile ? "auto" :"490px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? undefined : "space-between",
          mt: isMobile ? "24px" : "64px"
        }}
      >
        <Box sx={{ height: "40px", pb: "4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
  <Typography
    sx={{
      color: "#989898",
      fontSize: "16px",
      fontWeight: 700,
      lineHeight: "19px",
    }}
  >
    {stepIndex !== undefined ? `Step ${stepIndex}` : "Step"}
  </Typography>
  {!isMobile ? null : 
  <Typography
    sx={{
      color: "#989898",
      fontSize: "16px",
      fontWeight: 700,
      lineHeight: "19px",
    }}
  >
    {maxSteps !== undefined ? `/${maxSteps}` : "Step"}
  </Typography>
}
</Box>
{helpAvailable && (
<Box
  onClick={onHelpClick}
  sx={{
    height: "30px",
    width: "30px",
    mb: "4px",
    ml: isMobile ? "16px" : 0,
    borderRadius: "9999px",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  }}
>
  
    <Typography
      sx={{
        color: "#989898",
        fontSize: "16px",
        fontWeight: 700,
        lineHeight: "19px",
      }}
    >
      ?
    </Typography>
  
</Box>
)}
{!isMobile ? null :
 <Box sx={{ marginLeft: 'auto' }}>
            <img 
            src={EwiproLogo} 
            alt="Ewipro Logo" 
            style={{ height: "30px" }} 
            />
        </Box>}
      </Box>

      <Divider sx={{ mb: 2, color: "#D0DBE0" }} />
{isMobile ? null :
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: 700,
          lineHeight: "38px",
        }}
      >
        {stepName}
      </Typography>
}
      {helpAvailable && !isMobile && (
        <Box sx={{ position: "absolute", bottom: "-16px", left: "34px" }}>
          <HelpButton helpAvailable={helpAvailable} onHelpClick={onHelpClick} />
        </Box>
      )}
    </Box>
  );
};

export default StepHeader;
