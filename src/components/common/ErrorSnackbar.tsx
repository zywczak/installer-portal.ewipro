import React from "react";
import { Snackbar, Alert, Box } from "@mui/material";

interface ErrorSnackbarProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
  sidebarWidth?: number;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({
  message,
  onClose,
  duration = 5000,
  sidebarWidth = 250,
}) => {
  if (!message) return null;

  return (
    <Snackbar
      open={!!message}
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
          severity="error"
          sx={{ width: "auto", minWidth: 300, maxWidth: 600 }}
        >
          {message}
        </Alert>
      </Box>
    </Snackbar>
  );
};

export default ErrorSnackbar;
