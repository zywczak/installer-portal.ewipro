import React from "react";
import { Box, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";

import UserAvatar from "../UserAvatar";
import UserInfo from "./UserInfo";

interface SidebarHeaderProps {
  user: any;
  open: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  onToggle: () => void;
  onNavigate: (view: string) => void;
  onClose?: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  user,
  open,
  isDesktop,
  isMobile,
  onToggle,
  onNavigate,
  onClose,
}) => {
  const isOpenDesktop = isDesktop && open;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: isOpenDesktop || isMobile ? 2 : 1,
        mt: 2,
        px: 1,
        position: "relative",
      }}
    >
      {isMobile && onClose && (
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {isDesktop && (
        <Box
          sx={{
            display: "flex",
            justifyContent: isOpenDesktop ? "flex-end" : "center",
            alignItems: "center",
            height: isOpenDesktop ? 0 : 48,
            px: 1,
            position: isOpenDesktop ? "absolute" : "static",
            top: isOpenDesktop ? 24 : "auto",
            right: isOpenDesktop ? 0 : "auto",
            zIndex: 2,
          }}
        >
          <IconButton onClick={onToggle} sx={{ color: "white", transition: "transform 0.3s" }}>
            <MenuOpenIcon
              fontSize="medium"
              sx={{ transform: isOpenDesktop ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s" }}
            />
          </IconButton>
        </Box>
      )}

      <UserAvatar
        avatarUrl={user?.avatar}
        size={isOpenDesktop || isMobile ? 120 : 50}
        tooltip="My Profile"
        onClick={() => onNavigate("profile")}
      />

      {(isOpenDesktop || isMobile) && user && <UserInfo name={user.name} phone={user.phone} />}
    </Box>
  );
};

export default SidebarHeader;
