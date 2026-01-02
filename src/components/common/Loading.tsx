import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import Logo from "../../assets/EWI-Pro-Render-Systems.png";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loading: React.FC = () => {
    
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        justifyContent: "top",
        height: "100vh",
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 250,
            height: 250,
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="EWI-Pro-Render-Systems"
          sx={{
            height: "60px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />

        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "6px solid transparent",
            borderTopColor: "#757575",
            borderRightColor: "#418E44",
            borderBottomColor: "#757575",
            borderLeftColor: "#418E44",
            animation: `${spin} 1.5s linear infinite`,
          }}
        />
      </Box>
    </Box>
  );
};

export default Loading;
