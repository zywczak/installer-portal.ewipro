import React from "react";
import { Button, CircularProgress } from "@mui/material";

interface AcceptButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label: string;
  loadingLabel?: string;
  size?: "small" | "medium" | "large";
}

const sizeMap = {
  small: { height: 36, fontSize: 13 },
  medium: { height: 44, fontSize: 15 },
  large: { height: 48, fontSize: 16 },
};

const AcceptButton: React.FC<AcceptButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  label,
  loadingLabel,
  size = "large",
}) => {
  const { height, fontSize } = sizeMap[size] ?? sizeMap.large;

  return (
    <Button
      variant="contained"
      color="success"
      size={size === "small" ? "small" : "medium"}
      onClick={onClick}
      disabled={loading || disabled}
      sx={{
        borderRadius: 10,
        fontWeight: "bold",
        height,
        fontSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "uppercase",
      }}
    >
      {loading ? (
        <>
          <CircularProgress
            size={22}
            sx={{ color: "white", mr: 1 }}
          />
          {loadingLabel || "Please wait..."}
        </>
      ) : (
        label
      )}
    </Button>
  );
};


export default AcceptButton;
