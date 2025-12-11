import React, { useRef, useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import AuthBackground from "../components/auth/AuthBackground";
import AuthPanel from "../components/auth/AuthPanel";
import { useAuthView } from "../hooks/useAuthView";

const Auth: React.FC = () => {
  const { view, setView } = useAuthView("login");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  useEffect(() => {
    if (!isMobile || !panelRef.current) return;

    const updateHeight = () => setPanelHeight(panelRef.current!.offsetHeight);

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(panelRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [view, isMobile]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        position: "relative",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: isMobile ? "0 0 auto" : "1 1 50%",
          height: isMobile ? `calc(100vh - ${panelHeight}px)` : "100vh",
          transition: isMobile ? "height 0.3s ease" : undefined,
        }}
      >
        <AuthBackground isMobile={isMobile} />
      </Box>

      <Box
        ref={panelRef}
        sx={{
          flex: isMobile ? "0 0 auto" : "1 1 50%",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          mt: isMobile ? "-2rem" : 0,
          height: isMobile ? "auto" : "100vh",
        }}
      >
        <AuthPanel view={view} setView={setView} />
      </Box>
    </Box>
  );
};

export default Auth;
