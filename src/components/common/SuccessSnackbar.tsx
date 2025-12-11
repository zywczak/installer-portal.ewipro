import React from "react";
import { Snackbar, Alert, Box } from "@mui/material";

interface SuccessSnackbarProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
  sidebarWidth?: number;
}

const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  message,
  onClose,
  duration = 10000,
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
          severity="success"
          sx={{ width: "auto", minWidth: 300, maxWidth: 600 }}
        >
          {message}
        </Alert>
      </Box>
    </Snackbar>
  );
};

export default SuccessSnackbar;
