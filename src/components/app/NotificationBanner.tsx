import React from "react";
import { Box, IconButton, Drawer, Popover } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Header from "../common/Header";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationList from "../common/NotificationBanner/NotificationList";
import { Notification } from "../common/NotificationBanner/types";
import { t } from "i18next";

interface Props {
  isMobile: boolean;
  notifications: Notification[];
  open: boolean;
  drawerOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  onUnreadChange?: (hasUnread: boolean) => void;
}

const NotificationBanner: React.FC<Props> = ({
  isMobile,
  notifications,
  open,
  drawerOpen,
  onClose,
  anchorEl,
  onUnreadChange,
}) => {
  const {
    notifications: localNotifications,
    toggleRead,
    deleteNotification,
  } = useNotifications({ notifications, onUnreadChange });

  const header = (
    <Box px={3} pt={2}>
      <Header
        icon={<NotificationsIcon />}
        title={t("views.notifications.title")}
        description={t("views.notifications.description")}
        actions={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
      />
    </Box>
  );

  const content = (
    <Box flex={1} mx={3} overflow="hidden">
      <NotificationList
        notifications={localNotifications}
        onToggleRead={toggleRead}
        onDelete={deleteNotification}
        onClick={() => {}}
      />
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer anchor="left" open={drawerOpen} onClose={onClose}>
        <Box display="flex" flexDirection="column" height="100%">
          {header}
          {content}
        </Box>
      </Drawer>
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          width: 450,
          height: 500,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          border: "1px solid #e0e0e0",
        },
      }}
    >
      {header}
      {content}
    </Popover>
  );
};

export default NotificationBanner;
