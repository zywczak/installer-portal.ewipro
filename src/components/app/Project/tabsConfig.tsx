import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { JSX } from "react";

export const getTabsForWidth = (width: number): Array<{ key: string; label: string; icon: JSX.Element }> => {
  if (width > 1390) {
    return [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  } else if (width > 1000) {
    return [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
      { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  } else {
    return [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "chat", label: "Chat", icon: <ChatIcon /> },
      { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
      { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  }
};