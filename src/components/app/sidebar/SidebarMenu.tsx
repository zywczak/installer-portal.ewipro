import React from "react";
import { List } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import SidebarMenuItem from "./SidebarMenuItem";
import ScrollableContainerWithArrows from "../../common/ScrollableContainerWithArrows";
import { useTranslation } from "react-i18next";

interface SidebarMenuProps {
  currentView: string;
  isCollapsed: boolean;
  isMobile: boolean;
  onNavigate: (view: string) => void;
  onClose?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  currentView,
  isCollapsed,
  isMobile,
  onNavigate,
  onClose,
}) => {
  const { t } = useTranslation();
  const menuItems = [
    { text: t("drawer.dashboard"), icon: <DashboardIcon />, view: "dashboard" },
    { text: t("drawer.myProjects"), icon: <ListAltIcon />, view: "projects" },
    { text: t("drawer.subcontractors"), icon: <PeopleAltIcon />, view: "subcontractors" },
    { text: t("drawer.settings"), icon: <SettingsIcon />, view: "settings" },
    { text: t("drawer.ewiCalculator"), icon: <SettingsIcon />, view: "calculator" },
  ];

  return (
    <ScrollableContainerWithArrows>
      <List>
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.text}
            text={item.text}
            icon={item.icon}
            selected={currentView === item.view}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onClick={() => {
              onNavigate(item.view);
              if (isMobile && onClose) onClose();
            }}
          />
        ))}
      </List>
    </ScrollableContainerWithArrows>
  );
};

export default SidebarMenu;
