import React from "react";
import { Box, Typography, Divider, IconButton, useTheme } from "@mui/material";
import ScrollableContainerWithArrows from "../common/ScrollableContainerWithArrows";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read?: boolean;
}

interface NotificationListProps {
    notifications: Notification[];
    onClick: (notif: Notification) => void;
    onToggleRead: (notif: Notification) => void;
    onDelete: (notif: Notification) => void;
    showArrows?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    onClick,
    onToggleRead,
    onDelete,
    showArrows = true,
}) => {
    const theme = useTheme();

    return (
        <ScrollableContainerWithArrows showArrows={showArrows && notifications.length > 0}>
            {notifications.length === 0 ? (
                <Box sx={{ textAlign: "center", p: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        Brak powiadomień
                    </Typography>
                </Box>
            ) : (
                notifications.map((notif, idx) => (
                    <Box key={notif.id}>
                        <Box
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                                "&:hover": { backgroundColor: theme.palette.action.hover },
                            }}
                            onClick={() => onClick(notif)}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 0.5,
                                }}
                            >
                                <Typography fontWeight={notif.read ? 400 : 600} variant="body2">
                                    {notif.title}
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {notif.time}
                                    </Typography>

                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleRead(notif);
                                        }}
                                        sx={{ p: 0.5 }}
                                    >
                                        {notif.read ? (
                                            <VisibilityOffIcon fontSize="small" />
                                        ) : (
                                            <VisibilityIcon fontSize="small" />
                                        )}
                                    </IconButton>

                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(notif);
                                        }}
                                        sx={{ p: 0.5, color: theme.palette.error.main }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                }}
                            >
                                {notif.message}
                            </Typography>
                        </Box>

                        {idx < notifications.length - 1 && (
                            <Divider variant="fullWidth" sx={{ my: 0, mx: 15 }} />
                        )}
                    </Box>
                ))
            )}
        </ScrollableContainerWithArrows>
    );
};

export default NotificationList;
