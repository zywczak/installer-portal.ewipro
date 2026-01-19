import React from "react";
import { Box, IconButton, Drawer, Popover } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import Header from "../../common/Header";
import EmptyStateBox from "../../common/EmptyStateBox";
import { useNotifications } from "./useNotifications";
import NotificationList from "./NotificationList";
import { Notification } from "./types";
import { useTranslation } from "react-i18next";

interface Props {
  isMobile: boolean;
  notifications: Notification[];
  open: boolean;
  drawerOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  onUnreadChange?: (hasUnread: boolean) => void;
}

const Notifications: React.FC<Props> = ({
  isMobile,
  notifications,
  open,
  drawerOpen,
  onClose,
  anchorEl,
  onUnreadChange,
}) => {
  const { t } = useTranslation();
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
      {localNotifications.length === 0 ? (
        <EmptyStateBox
          icon={<NotificationsNoneIcon />}
          text={t("views.notifications.empty")}
          isDisabled={true}
        />
      ) : (
        <NotificationList
          notifications={localNotifications}
          onToggleRead={toggleRead}
          onDelete={deleteNotification}
           onClick={(notification) => {
            if (notification.projectID && notification.contactID) {
              globalThis.location.href = `#projects/${notification.projectID}/${notification.contactID}?${notification.slug}`;
            }
          }}
        />
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={onClose}
        slotProps={{ paper : {sx: { width: '100%', height: '100%', maxWidth: '100%' } }}}
      >
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
      slotProps={{
        paper: {
          sx: {
          width: 500,
          height: "auto",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
        },
      },
      }}
    >
      {header}
      {content}
    </Popover>
  );
};

export default Notifications;
