import React from "react";
import { Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SidebarMenuItem from "./SidebarMenuItem";
import { useTranslation } from "react-i18next";

interface SidebarFooterProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed, isMobile }) => {
  const { t } = useTranslation();
  
  const footerItems = [
    {
      text: t("drawer.logout"),
      icon: <LogoutIcon />,
      action: () => {
        localStorage.removeItem("access");
        globalThis.location.href = "/auth";
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {footerItems.map((item) => (
        <SidebarMenuItem
          key={item.text}
          text={item.text}
          icon={item.icon}
          selected={false}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          onClick={item.action}
        />
      ))}
    </Box>
  );
};

export default SidebarFooter;
