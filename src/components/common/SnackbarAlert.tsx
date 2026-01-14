import React from "react";
import { Snackbar, Alert, Box } from "@mui/material";
import { AuthNotification } from "../../types/auth.types";

interface SnackbarProps {
  notification: AuthNotification | null;
  onClose: () => void;
  duration?: number;
  sidebarWidth?: number;
}

const SnackbarAlert: React.FC<SnackbarProps> = ({
  notification,
  onClose,
  duration = 6000,
  sidebarWidth = 250,
}) => {
  if (!notification) return null;

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{
        width: "100%",
        bottom: "24px",
        position: "fixed",
        display: "flex",
        justifyContent: "flex-start",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "auto",
        }}
      >
        <Alert
          onClose={onClose}
          severity={notification?.type}
          sx={{ width: "auto", minWidth: 300, maxWidth: 600 }}
        >
          {notification?.message}
        </Alert>
      </Box>
    </Snackbar>
  );
};

export default SnackbarAlert;
