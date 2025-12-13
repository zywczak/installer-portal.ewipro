import React from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { AnimatePresence } from "framer-motion";

import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import CheckEmail from "./CheckEmail";
import AnimatedView from "./AnimatedView";
import { AuthView } from "../../types/auth.types";

interface AuthPanelProps {
  view: AuthView;
  toLogin: () => void;
  toRegister: () => void;
  toForgot: () => void;
  toCheck: () => void;
  toReset: () => void;
}

const AuthPanel: React.FC<AuthPanelProps> = ({
  view,
  toLogin,
  toRegister,
  toForgot,
  toCheck,
  toReset,
}) => {
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
        width: isMobile ? "100%" : "auto",
        maxHeight: isMobile ? "none" : "100vh",
        overflowY: "visible",
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
                onRegister={toRegister}
                onCheckEmail={toCheck}
                onForgotPassword={toForgot}
                onResetPassword={toReset}
              />
            </AnimatedView>
          )}

          {view === "register" && (
            <AnimatedView viewKey="register">
              <Register onBack={toLogin} onCheckEmail={toCheck} />
            </AnimatedView>
          )}

          {view === "forgot" && (
            <AnimatedView viewKey="forgot">
              <ForgotPassword onBack={toLogin} onCheckEmail={toCheck} />
            </AnimatedView>
          )}

          {view === "reset" && (
            <AnimatedView viewKey="reset">
              <ResetPassword onBackToLogin={toLogin} />
            </AnimatedView>
          )}

          {view === "check" && (
            <AnimatedView viewKey="check">
              <CheckEmail onBack={toLogin} />
            </AnimatedView>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default AuthPanel;
