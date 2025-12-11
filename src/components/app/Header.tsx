// import React from "react";
// import { Box, InputBase, IconButton, Badge } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import MenuIcon from "@mui/icons-material/Menu";
// import Logo from "../../assets/cropped-EWI-Pro-Logo.png";

// interface HeaderProps {
//   children?: React.ReactNode;
//   hasNewNotifications?: boolean;
//   onNotificationsClick?: (e: React.MouseEvent<HTMLElement>) => void;
//   onMenuClick?: () => void;
//   isMobile: boolean;
// }

// const Header: React.FC<HeaderProps> = ({
//   children,
//   hasNewNotifications = true,
//   onNotificationsClick,
//   onMenuClick,
//   isMobile,
// }) => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: isMobile ? "column" : "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         backgroundColor: "#ececec",
//         // boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         px: 4,
//         py: 2,
//         gap: isMobile ? 1 : 0,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           width: "100%",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 2,
//         }}
//       >
//         {isMobile && (
//           <IconButton onClick={onMenuClick} sx={{ color: "#555" }}>
//             <MenuIcon />
//           </IconButton>
//         )}

//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: isMobile ? "center" : "flex-start",
//             gap: 2,
//           }}
//         >
//           <img src={Logo} alt="Logo" height={35} />

//           {/* {!isMobile && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 backgroundColor: "white",
//                 borderRadius: 999,
//                 px: 2,
//                 ml: 4,
//                 py: 0.5,
//                 width: "45%",
//                 minWidth: 200,
//                 boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
//               }}
//             >
//               <SearchIcon sx={{ color: "#888", mr: 1, fontSize: 20 }} />
//               <InputBase
//                 placeholder="Wyszukaj..."
//                 sx={{ flex: 1, fontSize: "0.9rem", color: "#333" }}
//               />
//             </Box>
//           )} */}
//         </Box>

//         <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//           <IconButton onClick={onNotificationsClick} sx={{ color: "#555" }}>
//             <Badge
//               color="error"
//               variant={hasNewNotifications ? "dot" : undefined}
//               overlap="circular"
//             >
//               <NotificationsIcon />
//             </Badge>
//           </IconButton>
//         </Box>
//       </Box>

//       {/* {isMobile && (
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             backgroundColor: "white",
//             borderRadius: 999,
//             px: 2,
//             py: 0.5,
//             width: "80%",
//             mt: 1,
//             boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
//           }}
//         >
//           <SearchIcon sx={{ color: "#888", mr: 1, fontSize: 20 }} />
//           <InputBase
//             placeholder="Wyszukaj..."
//             sx={{ flex: 1, fontSize: "0.9rem", color: "#333" }}
//           />
//         </Box>
//       )} */}
//     </Box>
//   );
// };

// export default Header;





















import React from "react";
import { Box, IconButton, Badge, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../assets/cropped-EWI-Pro-Logo.png";

interface HeaderProps {
    hasNewNotifications?: boolean;
    onNotificationsClick?: (e: React.MouseEvent<HTMLElement>) => void;
    onMenuClick?: () => void;
    isMobile: boolean;
    projectAddress?: string | null;
}

const Header: React.FC<HeaderProps> = ({
    hasNewNotifications,
    onNotificationsClick,
    onMenuClick,
    isMobile,
    projectAddress,
}) => {

    const formatAddress = (addr: string) => {
    const parts = addr.split(", ");
    if (parts.length < 2) return addr;

    const postcode = parts[parts.length - 1];
    const main = parts.slice(0, parts.length - 1).join(", ");

    return (
        <Box
            sx={{
                textAlign: "center",
                mt: 1,
                lineHeight: 1.2,
                maxWidth: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 0.5,
            }}
        >
            <Typography 
                sx={{ 
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                }}
            >
                {postcode}
            </Typography>
            <Typography
                sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                }}
            >
                {main}
            </Typography>
        </Box>
    );
};


   return (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 4,
            py: 3,
            mb: 2,
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
                    variant={hasNewNotifications ? "dot" : undefined}
                    overlap="circular"
                >
                    <NotificationsIcon sx={{ fontSize: 32 }} />
                </Badge>
            </IconButton>
        </Box>

        {/* ADRES — zawsze w nowej linii */}
        {projectAddress && formatAddress(projectAddress)}

    </Box>
);

};

export default Header;