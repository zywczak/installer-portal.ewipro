import React from "react";
import { Link } from "@mui/material";

interface ActionLinkProps {
  label: string;
  onClick: () => void;
  align?: "left" | "center" | "right";
}

const ActionLink: React.FC<ActionLinkProps> = ({
  label,
  onClick,
  align = "center",
}) => (
  <Link
    onClick={onClick}
    sx={{
      cursor: "pointer",
      textAlign: align,
      textDecoration: "none",
      color: "success.main",
      fontWeight: "bold",
      "&:hover": { textDecoration: "underline" },
    }}
  >
    {label}
  </Link>
);

export default ActionLink;
