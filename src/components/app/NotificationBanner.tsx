import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Popover, Drawer, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationList, { Notification } from "../common/NotificationList";

interface NotificationBannerProps {
    isMobile: boolean;
    notifications: Notification[];
    open: boolean;
    drawerOpen: boolean;
    onClose: () => void;
    anchorEl?: HTMLElement | null;

    onUnreadChange?: (hasUnread: boolean) => void;
}

const API_URL = "https://api-veen-e.ewipro.com/installer/info/";

const NotificationBanner: React.FC<NotificationBannerProps> = ({
    isMobile,
    notifications,
    open,
    drawerOpen,
    onClose,
    anchorEl,
    onUnreadChange,
}) => {
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

    // aktualizacja gdy przyjdą nowe z backendu
    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    const token = localStorage.getItem("access");

    // powiadomienie rodzica o liczbie nieprzeczytanych
    useEffect(() => {
        const hasUnread = localNotifications.some((n) => !n.read);
        onUnreadChange?.(hasUnread);
    }, [localNotifications]);

    const sendAction = async (action: string, notificationID: number) => {
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action, notificationID }),
            });
        } catch (err) {
            console.error("Błąd sieci:", err);
        }
    };

    const handleToggleRead = (notif: Notification) => {
        const action = notif.read ? "markNotificationUnread" : "markNotificationRead";

        // OPTIMISTIC UPDATE
        setLocalNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, read: !n.read } : n))
        );

        sendAction(action, notif.id);
    };

    const handleDelete = (notif: Notification) => {
        setLocalNotifications((prev) => prev.filter((n) => n.id !== notif.id));
        sendAction("deleteNotification", notif.id);
    };

    const Header = (
        <Box>
            <Box
                sx={{
                    position: "relative",
                    py: 2,
                    px: 3,
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <NotificationsIcon sx={{ fontSize: 32, color: "#777" }} />

                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Notifications
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: "#777" }}>
                            New activity updates
                        </Typography>
                    </Box>
                </Box>

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mx: 3 }} />
        </Box>
    );

    const NotificationContent = (
        <Box sx={{ flex: 1, overflow: "hidden", mx: 3 }}>
            <NotificationList
                notifications={localNotifications}
                onClick={() => {}}
                onToggleRead={handleToggleRead}
                onDelete={handleDelete}
                showArrows={localNotifications.length > 0}
            />
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={onClose}
                PaperProps={{ sx: { width: "100%", height: "100%", display: "flex" } }}
            >
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {Header}
                    {NotificationContent}
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
                    borderRadius: 3,
                    overflow: "hidden",
                },
            }}
        >
            {Header}
            {NotificationContent}
        </Popover>
    );
};

export default NotificationBanner;
