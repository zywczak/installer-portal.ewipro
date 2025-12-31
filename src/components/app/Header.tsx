import React from "react";
import { Box, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../assets/cropped-EWI-Pro-Logo.png";
import { Address } from "../common/address";
import { SubcontractorName } from "../common/SubcontractorName";

interface HeaderProps {
    hasNewNotifications?: boolean;
    onNotificationsClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onMenuClick?: () => void;
    isMobile: boolean;
    projectAddress?: string | null;
    subcontractorName?: string | null;
}

const Header: React.FC<HeaderProps> = ({
    hasNewNotifications,
    onNotificationsClick,
    onMenuClick,
    isMobile,
    projectAddress,
    subcontractorName,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: isMobile ? 0 : 4,
                py: 2,
                position: "relative",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 18,
                    right: 18,
                    height: "1px",
                    backgroundColor: "#BDBDBD",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                    justifyContent: "space-between",
                    position: "relative",
                }}
            >
                {isMobile && (
                    <IconButton onClick={onMenuClick}>
                        <MenuIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                )}

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: isMobile ? "center" : "flex-start",
                        position: isMobile ? "absolute" : "static",
                        left: 0,
                        right: 0,
                        pointerEvents: "none",
                    }}
                >
                    <img src={Logo} alt="Logo" height={45} />
                </Box>

                <IconButton onClick={onNotificationsClick}>
                    <Badge
                        color="error"
                        variant={hasNewNotifications ? "dot" : "standard"}
                        overlap="circular"
                    >
                        <NotificationsIcon sx={{ fontSize: 32 }} />
                    </Badge>
                </IconButton>
            </Box>

            {projectAddress && <Address addr={projectAddress} />}

            {subcontractorName && <SubcontractorName name={subcontractorName} />}
        </Box>
    );
};

export default Header;
