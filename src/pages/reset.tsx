import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme, useMediaQuery, Container } from "@mui/material";
import AuthBackground from "../components/auth/AuthBackground";
import NotificationSnackbar from "../components/common/SnackbarAlert";
import { SnackbarProvider, useAuthNotification } from "../context/AuthContext";
import ResetPassword from "../components/auth/ResetPassword";

const ResetContent: React.FC = () => {
    const { notification, clearNotification } = useAuthNotification();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const panelRef = useRef<HTMLDivElement>(null);
    const [panelHeight, setPanelHeight] = useState(0);

    useEffect(() => {
        if (!isMobile || !panelRef.current) return;

        const updateHeight = () => setPanelHeight(panelRef.current!.offsetHeight);
        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        observer.observe(panelRef.current);
        window.addEventListener("resize", updateHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, [isMobile]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    height: "100vh",
                    position: "relative",
                    backgroundColor: "white",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        flex: isMobile ? "0 0 auto" : "1 1 50%",
                        height: isMobile ? `calc(100vh - ${panelHeight}px)` : "100vh",
                        transition: isMobile ? "height 0.3s ease" : undefined,
                    }}
                >
                    <AuthBackground isMobile={isMobile} />
                </Box>

                <Box
                    ref={panelRef}
                    sx={{
                        flex: isMobile ? "0 0 auto" : "1 1 50%",
                        display: "flex",
                        alignItems: "stretch",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 2,
                        mt: isMobile ? "-2rem" : 0,
                        height: isMobile ? "auto" : "100vh",
                    }}
                >
                    <Box
                        sx={{
                            flex: isMobile ? "0 0 auto" : "1 1 50%",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#fff",
                            borderRadius: isMobile ? "2rem 2rem 0 0" : "2rem 0 0 2rem",
                            position: "relative",
                            width: isMobile ? "100%" : "auto",
                            maxHeight: isMobile ? "none" : "100vh",
                            overflowY: "visible",
                            "&::-webkit-scrollbar": { display: "none" },
                            zIndex: 2,
                            ml: isMobile ? 0 : "-2rem",
                        }}
                    >
                        <Container maxWidth="xs" sx={{ pt: isMobile ? 3 : 6 }}>

                            <ResetPassword onBackToLogin={() => { globalThis.location.href = "/auth"; }} />

                        </Container>
                    </Box>
                </Box>
            </Box>

            <NotificationSnackbar notification={notification} onClose={clearNotification} sidebarWidth={0} />
        </>
    );
};

const Reset: React.FC = () => (
    <SnackbarProvider>
        <ResetContent />
    </SnackbarProvider>
);

export default Reset;
