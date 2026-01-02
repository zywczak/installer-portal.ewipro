import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import bg from "../../assets/ewistore-splash.jpg";

interface AuthBackgroundProps {
  isMobile?: boolean;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ isMobile }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const mobile = isMobile ?? isSm;

  return (
    <Box
      sx={{
        flex: mobile ? "1 1 auto" : "1 1 50%",
        height: "100%",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "height 0.3s ease",
      }}
    >
      {!mobile && (
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            width: "70%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {/* <EwiproLogo width="100%" height="100%" /> */}
        </Box>
      )}

      {mobile && (
        <Box
          sx={{
            width: "80%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <EwiproLogo width="100%" /> */}
        </Box>
      )}
    </Box>
  );
};

export default AuthBackground;
