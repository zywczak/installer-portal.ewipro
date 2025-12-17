import React, { useState, useEffect } from "react";
import { Box, Divider } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import SidebarFooter from "../common/sidebar/SidebarFooter";
import SidebarMenu from "../common/sidebar/SidebarMenu";
import SidebarHeader from "../common/sidebar/SidebarHeader";
import api from "../../api/axiosApi";

interface SidebarProps {
  navigateTo: (view: string) => void;
  currentView: string;
  onClose?: () => void;
  onWidthChange?: (width: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  navigateTo,
  currentView,
  onClose,
  onWidthChange,
}) => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  const isMobile = !!onClose;
  const isDesktop = !isMobile;

  const isOpenDesktop = isDesktop && open;
  const isClosedDesktop = isDesktop && !open;
  const isOpenMobile = isMobile && open;

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const { data } = await api.post({ action: "getBasicUserData" });

      setUser({
        initials: data.name
          ? data.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
          : "U",
        name: data.name || "Unknown User",
        phone: data.phones?.mobile || data.phones?.phone || "No phone",
        avatar: data.avatar || "",
      });

      localStorage.setItem("userAvatar", data.avatar);
      console.log("Sidebar fetched user avatar:", data.avatar);
    } catch (error) {
      console.error("Błąd przy pobieraniu danych użytkownika:", error);
    }
  };
  fetchUserData();
}, []);

  useEffect(() => {
    if (onWidthChange && isDesktop) {
      onWidthChange(isOpenDesktop ? 250 : 80);
    }
  }, [isOpenDesktop, isDesktop, onWidthChange]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (!isMobile) setOpen(width >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  if (isMobile && !isOpenMobile) return null;

  const SidebarContent = (
    <Box
      sx={{
        height: "100%",
        width: isMobile ? "100%" : isOpenDesktop ? 250 : 80,
        background: "#2D3538",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.3s ease-in-out",
        position: "relative",
      }}
    >
      <SidebarHeader
        user={user}
        open={open}
        isDesktop={isDesktop}
        isMobile={isMobile}
        onToggle={() => setOpen(!open)}
        onNavigate={navigateTo}
        onClose={onClose}
      />

      <SidebarMenu
        currentView={currentView}
        isCollapsed={isClosedDesktop}
        isMobile={isMobile}
        onNavigate={navigateTo}
        onClose={onClose}
      />

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 1 }} />

      <SidebarFooter
        isCollapsed={isClosedDesktop}
        isMobile={isMobile}
      />
    </Box>
  );

  return isMobile ? (
    <AnimatePresence>
      {isOpenMobile && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1300 }}
        >
          {SidebarContent}
        </motion.div>
      )}
    </AnimatePresence>
  ) : (
    SidebarContent
  );
};

export default Sidebar;
