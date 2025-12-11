import React from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import CheckEmail from "./CheckEmail";
import ForgotPassword from "./ForgotPassword";
import AnimatedView from "./AnimatedView";

interface AuthPanelProps {
  view: "login" | "register" | "check" | "forgot";
  setView: (v: "login" | "register" | "check" | "forgot") => void;
}

const AuthPanel: React.FC<AuthPanelProps> = ({ view, setView }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        flex: isMobile ? "0 0 auto" : "1 1 50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: isMobile ? "2rem 2rem 0 0" : "2rem 0 0 2rem",
        position: "relative",
        bottom: "auto",
        width: isMobile ? "100%" : "auto",
        maxHeight: isMobile ? "none" : "100vh",
        overflowY: isMobile ? "visible" : "visible",
        "&::-webkit-scrollbar": { display: "none" },
        zIndex: 2,
        ml: isMobile ? 0 : "-2rem",
      }}
    >
      <Container maxWidth="xs" sx={{ pt: isMobile ? 3 : 6 }}>
        <AnimatePresence mode="wait">
          {view === "login" && (
            <AnimatedView viewKey="login">
              <Login
                onRegister={() => setView("register")}
                onCheckEmail={() => setView("check")}
                onForgotPassword={() => setView("forgot")}
              />
            </AnimatedView>
          )}

          {view === "register" && (
            <AnimatedView viewKey="register">
              <Register
                onBack={() => setView("login")}
                onCheckEmail={() => setView("check")}
              />
            </AnimatedView>
          )}

          {view === "forgot" && (
            <AnimatedView viewKey="forgot">
              <ForgotPassword onBack={() => setView("login")} />
            </AnimatedView>
          )}

          {view === "check" && (
            <AnimatedView viewKey="check">
              <CheckEmail onBack={() => setView("login")} />
            </AnimatedView>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default AuthPanel;
