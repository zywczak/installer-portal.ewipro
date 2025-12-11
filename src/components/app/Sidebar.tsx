import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Avatar,
  Typography,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ScrollableContainerWithArrows from "../common/ScrollableContainerWithArrows";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  navigateTo: (view: string) => void;
  currentView: string;
  onClose?: () => void; // obecne tylko w wersji mobile
  onWidthChange?: (width: number) => void; // dla desktop
}

const Sidebar: React.FC<SidebarProps> = ({
  navigateTo,
  currentView,
  onClose,
  onWidthChange,
}) => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { t } = useTranslation();

  const isMobile = !!onClose;
  const isDesktop = !isMobile;

  const isOpenDesktop = isDesktop && open;
  const isClosedDesktop = isDesktop && !open;
  const isOpenMobile = isMobile && open;

  // Ustawienie domyślnego stanu otwarcia
  useEffect(() => {
    setOpen(true);
  }, [isMobile]);

  // Aktualizacja szerokości sidebar w desktop
  useEffect(() => {
    if (onWidthChange && isDesktop) {
      onWidthChange(isOpenDesktop ? 250 : 80);
    }
  }, [isOpenDesktop, isDesktop, onWidthChange]);

  useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;

    if (!isMobile) {
      // Desktop: automatycznie zamykamy/otwieramy w zależności od szerokości
      setOpen(width >= 1024);
    }
    // Mobile: nic nie zmieniamy, otwarcie kontroluje onClose
  };

  // wywołanie przy starcie
  handleResize();

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [isMobile]);



  // Pobranie danych użytkownika
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access");
        console.log( token);
        if (!token) return;

        const { data } = await axios.post(
          "https://api-veen-e.ewipro.com/installer/info/",
          { action: "getBasicUserData" },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser({
          initials: data.name
            ? data.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            : "U",
          name: data.name || "Unknown User",
          phone: data.phones?.mobile || data.phones?.phone || "No phone",
          avatar: data.avatar || "",
        });
        localStorage.setItem("userAvatar", data.avatar);
      } catch (error) {
        console.error("Błąd przy pobieraniu danych użytkownika:", error);
      }
    };

    fetchUserData();
  }, []);

  // Menu i footer
  const menuItems = [
    { text: t("drawer.dashboard"), icon: <DashboardIcon />, view: "dashboard" },
    { text: t("drawer.myProjects"), icon: <ListAltIcon />, view: "projects" },
    { text: t("drawer.subcontractors"), icon: <PeopleAltIcon />, view: "subcontractors" },
    { text: "EWI kalkulator", icon: <CalculateOutlinedIcon />, view: "materialsCalculator" },
    { text: t("drawer.settings"), icon: <SettingsIcon />, view: "settings" },
  ];

  const footerItems = [
    {
      text: t("drawer.logout"),
      icon: <LogoutIcon />,
      action: () => {
        localStorage.removeItem("access");
        window.location.href = "/auth";
      },
    },
  ];

  // Jeśli mobile i sidebar jest zamknięty, nic nie renderujemy
  if (isMobile && !isOpenMobile) return null;

  // Zawartość sidebar – wspólna dla desktop i mobile
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
      {/* Close button – mobile only */}
      {isMobile && (
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "white", zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Toggle button desktop */}
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
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ color: "white", transition: "transform 0.3s ease-in-out" }}
          >
            <MenuOpenIcon
              fontSize="medium"
              sx={{
                transform: isOpenDesktop ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </IconButton>
        </Box>
      )}

      {/* Avatar + user info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: (isOpenDesktop || isOpenMobile) ? 2 : 1,
          mt: 2,
          px: 1,
        }}
      >
        <Tooltip title={t("drawer.myProfile")} placement="right" arrow>
          <Avatar
            src={user?.avatar}
            onClick={() => navigateTo("profile")}
            sx={{
              width: (isOpenDesktop || isOpenMobile) ? 100 : 50,
              height: (isOpenDesktop || isOpenMobile) ? 100 : 50,
              mb: (isOpenDesktop || isOpenMobile) ? 1 : 0,
              bgcolor: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.08)", boxShadow: "0 0 15px rgba(255,255,255,0.4)" },
            }}
          >
            {!user?.avatar && user?.initials}
          </Avatar>
        </Tooltip>
        {(isOpenDesktop || isOpenMobile) && user && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    style={{ textAlign: "center" }}
  >
    <Typography variant="subtitle1" fontWeight={500}>
      {user.name}
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.7 }}>
      {user.phone}
    </Typography>
  </motion.div>
)}

      </Box>

      {/* Menu items */}
      <ScrollableContainerWithArrows>
        <List>
          {menuItems.map((item) => (
            <Tooltip
              key={item.text}
              title={isClosedDesktop ? item.text : ""}
              placement="right"
              arrow
            >
              {isMobile ? (
                <ListItemButton
                  onClick={() => {
                    navigateTo(item.view);
                    if (onClose) onClose();
                  }}
                  selected={currentView === item.view}
                  sx={{
                    width: "100%",
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    mb: 0.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "background-color 0.3s, transform 0.3s",
                    "&:hover": { bgcolor: "#4D5256", transform: "scale(1.02)" },
                    "&.Mui-selected": { bgcolor: "rgba(0,0,0,0.08)" },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: 200,
                      fontWeight: 500,
                    }}
                  >
                    <span>{item.text}</span>
                    <span>{item.icon}</span>
                  </Typography>
                </ListItemButton>
              ) : (

                <ListItemButton
  onClick={() => navigateTo(item.view)}
  selected={currentView === item.view}
  sx={{
    py: 1,
    px: 1.5,
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    width: "auto",
    justifyContent: isClosedDesktop ? "center" : "flex-start",
    transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
    "&:hover": { bgcolor: "#4D5256", transform: "scale(1.02)" },
    "&.Mui-selected": { bgcolor: "rgba(0,0,0,0.08)" },
    "&.Mui-selected:hover": { bgcolor: "#4D5256" },
  }}
>
  <ListItemIcon sx={{ color: "white", minWidth: 0, justifyContent: "center" }}>
    {item.icon}
  </ListItemIcon>

  {/* Animowany tekst z opóźnieniem */}
  {isOpenDesktop && (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }} // <-- opóźnienie 0.2s
      style={{ width: "100%" }}
    >
      <ListItemText
        primary={item.text}
        primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem" }}
        sx={{ ml: 1 }}
      />
    </motion.div>
  )}
</ListItemButton>

              )}
            </Tooltip>
          ))}
        </List>
      </ScrollableContainerWithArrows>

      {/* Footer */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 1 }} />
    <Box
  sx={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: isMobile ? "center" : "stretch",
  }}
>
  {footerItems.map((item) => (
    <Tooltip
      key={item.text}
      title={isClosedDesktop ? item.text : ""}
      placement="right"
      arrow
    >
      <ListItemButton
        onClick={item.action}
        sx={{
          py: 1,
          px: 1.5,
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          width: isMobile ? 200 : "auto",
          justifyContent: isClosedDesktop ? "center" : isMobile ? "space-between" : "flex-start",
          color: "white",
          transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
          "&:hover": { bgcolor: "#4D5256", transform: "scale(1.02)" },
        }}
      >
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {item.text}
            </Typography>
          </motion.div>
        )}
        <ListItemIcon
          sx={{
            color: "white",
            minWidth: 0,
            justifyContent: "center",
            ml: isMobile ? 1 : 0,
            mr: isMobile ? 0 : 1,
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!isMobile && !isClosedDesktop && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ width: "100%" }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem" }}
              sx={{ ml: 1 }}
            />
          </motion.div>
        )}
      </ListItemButton>
    </Tooltip>
  ))}
</Box>
    </Box>
  );

  // Mobile animation
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