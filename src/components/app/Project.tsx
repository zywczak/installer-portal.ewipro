// import React, { useState, useEffect } from "react";
// import { Box, CircularProgress, Typography } from "@mui/material";
// import axios from "axios";
// import ProjectHeader from "../common/ProjectHeader";
// import { Documents } from "../common/Documents";
// import { DeliveriesList } from "../common/DeliveriesList";
// import EWIProBoard from "../common/EWIProBoard";
// import { Photos } from "../common/Photos";
// import ProjectAddress from "../common/ProjectAddress";
// import { Orders } from "../common/Orders";


// interface ProjectProps {
//   projectId: string;
//   contactId: string;
// }

// interface WarrantyFile {
//   name: string;
//   url: string;
//   date: string;
// }

// interface ProjectMember {
//   memberID: number;
//   name: string;
//   avatar?: string | null | false;
// }

// interface ProjectDetails {
//   id: number;
//   projectCode: string;
//   projectStatusName: string;
//   projectStatusColor: string;
//   access_type_name: string;
//   projectStartDate: string;
//   projectFinishDate: string;
//   projectStage: number;
//   projectMaxStage: number;
//   stagingSystemID: number;

//   address1?: string;
//   address2?: string;
//   address3?: string;
//   postcode?: string;

//   owner: {
//     installerID: number;
//     name: string;
//     companyName: string;
//     email: string;
//     mobile: string;
//     avatar?: string;
//   };

//   projectWarranty: {
//     approved?: {
//       number: string;
//       warrantyType: number;
//       period: number;
//       status: string;
//       downloadURI?: string;
//     };
//     others: WarrantyFile[];
//   } | null;

//   deliveries: any[];
//   projectMembers: ProjectMember[];
// }

// const Project: React.FC<ProjectProps> = ({ projectId, contactId }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [project, setProject] = useState<ProjectDetails | null>(null);

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("access");
//         const res = await axios.post(
//           "https://api-veen-e.ewipro.com/installer/info/",
//           { action: "getProjectDetails", projectID: projectId, contactID: contactId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data?.status && res.data?.result) {
//           setProject(res.data.result);
//         } else {
//           setError("Nie udało się pobrać danych projektu lub nie znaleziono rezultatu.");
//         }
//       } catch (err: any) {
//         console.error("Błąd pobierania projektu:", err);
//         setError(err.response?.data?.message || "Błąd sieciowy podczas pobierania projektu.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectDetails();
//   }, [projectId, contactId]);

//   if (loading)
//     return (
//       <Box textAlign="center" py={4}>
//         <CircularProgress />
//         <Typography>Ładowanie danych projektu...</Typography>
//       </Box>
//     );

//   if (error)
//     return (
//       <Box textAlign="center" py={4}>
//         <Typography color="error">Błąd: {error}</Typography>
//       </Box>
//     );

//   if (!project)
//     return (
//       <Box textAlign="center" py={4}>
//         <Typography>Projekt nie został znaleziony.</Typography>
//       </Box>
//     );

//   return (
//     <Box p={2}>
//       <ProjectAddress
//   postcode={project.postcode}
//   address1={project.address1}
//         address2={project.address2}
//         address3={project.address3}
// />
//       <ProjectHeader
//         installer={project.owner.name}
//         startDate={project.projectStartDate}
//         finishDate={project.projectFinishDate}
//         currentStage={project.projectStage}
//         stagingSystemID={project.stagingSystemID}
//         projectCode={project.projectCode}
//         address1={project.address1}
//         address2={project.address2}
//         address3={project.address3}
//         postcode={project.postcode}
//         access_type_name={project.access_type_name}
//         ownerAvatar={project.owner.avatar}
//         ownerId={project.owner.installerID}
//         projectMembers={project.projectMembers.map((m) => ({
//           id: m.memberID,
//           name: m.name,
//           avatar: m.avatar ? String(m.avatar) : null,
//         }))}
//         projectMaxStage={project.projectMaxStage}
//         projectStatusName={project.projectStatusName}
//         approvedWarranty={project.projectWarranty?.approved || null}
//       />

// <Box
//   display="flex"
//   flexWrap="wrap"
//   gap={2}
//   justifyContent="space-between"
// >
//   {/* Photos */}
//   <Box
//     flex="1 1 400px"
//     minWidth="400px"
//     sx={{
//       borderRadius: 3,
//       overflow: "hidden",
//       boxShadow: 2,
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//     <Photos
//       projectId={project.id}
//       contactId={Number(contactId)}
//       isProjectClosed={project.projectStatusName === "Closed"}
//     />
//   </Box>

//   {/* EWIProBoard */}
//   <Box
//     flex="1 1 500px"
//     minWidth="500px"
//     maxHeight="600px"
//     sx={{
//       borderRadius: 3,
//       overflow: "hidden",
//       boxShadow: 2,
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//     <EWIProBoard projectId={projectId} />
//   </Box>

//   {/* Documents */}
//   <Box
//     flex="1 1 400px"
//     minWidth="400px"
//     sx={{
//       borderRadius: 3,
//       overflow: "hidden",
//       boxShadow: 2,
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//     <Documents projectId={project.id} />
//   </Box>
// </Box>


//       <Box mt={2}>
//         <DeliveriesList deliveries={project.deliveries} />
//       </Box>

//       <Box mt={2}>
//         <Orders projectID={project.id} contactID={Number(contactId)} />
//       </Box>
//     </Box>
//   );
// };

// export default Project;





















































// import React, { useState, useEffect } from "react";
// import { Box, CircularProgress, Typography, BottomNavigation, BottomNavigationAction } from "@mui/material";
// import HomeIcon from '@mui/icons-material/Home';
// import ChatIcon from '@mui/icons-material/Chat';
// import DescriptionIcon from '@mui/icons-material/Description';
// import ListAltIcon from '@mui/icons-material/ListAlt';
// import axios from "axios";
// import ProjectHeader from "../common/ProjectHeader";
// import { Documents } from "../common/Documents";
// import { DeliveriesList } from "../common/DeliveriesList";
// import EWIProBoard from "../common/EWIProBoard";
// import { Photos } from "../common/Photos";
// import ProjectAddress from "../common/ProjectAddress";
// import { Orders } from "../common/Orders";

// interface ProjectProps {
//   projectId: string;
//   contactId: string;
// }

// interface WarrantyFile {
//   name: string;
//   url: string;
//   date: string;
// }

// interface ProjectMember {
//   memberID: number;
//   name: string;
//   avatar?: string | null | false;
// }

// interface ProjectDetails {
//   id: number;
//   projectCode: string;
//   projectStatusName: string;
//   projectStatusColor: string;
//   access_type_name: string;
//   projectStartDate: string;
//   projectFinishDate: string;
//   projectStage: number;
//   projectMaxStage: number;
//   stagingSystemID: number;

//   address1?: string;
//   address2?: string;
//   address3?: string;
//   postcode?: string;

//   owner: {
//     installerID: number;
//     name: string;
//     companyName: string;
//     email: string;
//     mobile: string;
//     avatar?: string;
//   };

//   projectWarranty: {
//     approved?: {
//       number: string;
//       warrantyType: number;
//       period: number;
//       status: string;
//       downloadURI?: string;
//     };
//     others: WarrantyFile[];
//   } | null;

//   deliveries: any[];
//   projectMembers: ProjectMember[];
// }


// const Project: React.FC<ProjectProps> = ({ projectId, contactId }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [project, setProject] = useState<ProjectDetails | null>(null);

//   // Dodajemy stan dla aktywnej sekcji w mobilce
//   const [activeTab, setActiveTab] = useState<"home" | "chat" | "documents" | "orders">("home");

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("access");
//         const res = await axios.post(
//           "https://api-veen-e.ewipro.com/installer/info/",
//           { action: "getProjectDetails", projectID: projectId},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data?.status && res.data?.result) {
//           setProject(res.data.result);
//         } else {
//           setError("Nie udało się pobrać danych projektu lub nie znaleziono rezultatu.");
//         }
//       } catch (err: any) {
//         console.error("Błąd pobierania projektu:", err);
//         setError(err.response?.data?.message || "Błąd sieciowy podczas pobierania projektu.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectDetails();
//   }, [projectId, contactId]);

//   if (loading)
//     return (
//       <Box textAlign="center" py={4}>
//         <CircularProgress />
//         <Typography>Ładowanie danych projektu...</Typography>
//       </Box>
//     );

//   if (error)
//     return (
//       <Box textAlign="center" py={4}>
//         <Typography color="error">Błąd: {error}</Typography>
//       </Box>
//     );

//   if (!project)
//     return (
//       <Box textAlign="center" py={4}>
//         <Typography>Projekt nie został znaleziony.</Typography>
//       </Box>
//     );

//   // Funkcja sprawdzająca, czy jesteśmy na mobilce
//   const isMobile = window.innerWidth <= 768;

//   return (
//     <Box p={2} pt={0} pb={isMobile ? 7 : 2} /* zostaw miejsce na dolny pasek */>
//       {/* <ProjectAddress
//         postcode={project.postcode}
//         address1={project.address1}
//         address2={project.address2}
//         address3={project.address3}
//       /> */}
//       <ProjectHeader
//         installer={project.owner.name}
//         startDate={project.projectStartDate}
//         finishDate={project.projectFinishDate}
//         currentStage={project.projectStage}
//         stagingSystemID={project.stagingSystemID}
//         projectCode={project.projectCode}
//         address1={project.address1}
//         address2={project.address2}
//         address3={project.address3}
//         postcode={project.postcode}
//         access_type_name={project.access_type_name}
//         ownerAvatar={project.owner.avatar}
//         ownerId={project.owner.installerID}
//         projectMembers={project.projectMembers.map((m) => ({
//           id: m.memberID,
//           name: m.name,
//           avatar: m.avatar ? String(m.avatar) : null,
//         }))}
//         projectMaxStage={project.projectMaxStage}
//         projectStatusName={project.projectStatusName}
//         approvedWarranty={project.projectWarranty?.approved || null}
//       />

//       {/* Sekcje */}
//       {(activeTab === "home" || !isMobile) && (
//         <>
//           <Box
//             display="flex"
//             flexWrap="wrap"
//             gap={2}
//             justifyContent="space-between"
//             mt={2}
//           >
//             {/* Photos */}
//             <Box
//     flex={isMobile ? "1 1 100%" : "1 1 400px"}
//     minWidth={isMobile ? "100%" : 400}
//     sx={{
//       borderRadius: 3,
//       overflow: "hidden",
//       boxShadow: 2,
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//               <Photos
//                 projectId={project.id}
//                 contactId={Number(contactId)}
//                 isProjectClosed={project.projectStatusName === "Closed"}
//               />
//             </Box>

//             {/* EWIProBoard */}
//             <Box
//                flex={isMobile ? "1 1 100%" : "1 1 500px"}
//     minWidth={isMobile ? "100%" : 500}
//               maxHeight="600px"
//               sx={{
//                 borderRadius: 3,
//                 overflow: "hidden",
//                 boxShadow: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <EWIProBoard projectId={projectId} />
//             </Box>

//             {/* Documents */}
//               <Box
//                 flex={isMobile ? "1 1 100%" : "1 1 400px"}
//                 minWidth={isMobile ? "100%" : 400}
//                 sx={{
//                   borderRadius: 3,
//                   overflow: "hidden",
//                   boxShadow: 2,
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 <Documents projectId={project.id} />
//               </Box>
//           </Box>

//           <Box mt={2}>
//             <DeliveriesList deliveries={project.deliveries} />
//           </Box>
//         </>
//       )}

//       {/* Mobile: Chat */}
//       {isMobile && activeTab === "chat" && (
//         <Box mt={2} sx={{ borderRadius: 3, overflow: "hidden"}}>
//           <EWIProBoard projectId={projectId} />
//         </Box>
//       )}

//       {/* Mobile: Documents */}
//       {isMobile && activeTab === "documents" && (
//         <Box mt={2}>
//           <Documents projectId={project.id} />
//         </Box>
//       )}

//       {/* Mobile: Orders */}
//       {isMobile && activeTab === "orders" && (
//         <Box mt={2}>
//           <Orders projectID={project.id} contactID={Number(contactId)} />
//         </Box>
//       )}

//       {/* Dolny pasek nawigacyjny dla mobilki */}
//       {isMobile && (
//         <Box
//           position="fixed"
//           bottom={0}
//           left={0}
//           right={0}
//           zIndex={1000}
//           sx={{ borderTop: "1px solid #ddd" }}
//         >
//           <BottomNavigation
//             showLabels
//             value={activeTab}
//             onChange={(event, newValue) => setActiveTab(newValue)}
//           >
//             <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
//             <BottomNavigationAction label="Chat" value="chat" icon={<ChatIcon />} />
//             <BottomNavigationAction label="Documents" value="documents" icon={<DescriptionIcon />} />
//             <BottomNavigationAction label="Orders" value="orders" icon={<ListAltIcon />} />
//           </BottomNavigation>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Project;

































// import React, { useState, useEffect } from "react";
// import { Box, CircularProgress, Typography, BottomNavigation, BottomNavigationAction } from "@mui/material";
// import HomeIcon from '@mui/icons-material/Home';
// import ChatIcon from '@mui/icons-material/Chat';
// import DescriptionIcon from '@mui/icons-material/Description';
// import ListAltIcon from '@mui/icons-material/ListAlt';
// import axios from "axios";
// import ProjectHeader from "../common/ProjectHeader";
// import { Documents } from "../common/Documents";
// import { DeliveriesList } from "../common/DeliveriesList";
// import EWIProBoard from "../common/EWIProBoard";
// import { Photos } from "../common/Photos";
// import { Orders } from "../common/Orders";

// interface ProjectProps {
//   projectId: string;
//   contactId: string;
// }

// interface WarrantyFile {
//   name: string;
//   url: string;
//   date: string;
// }

// interface ProjectMember {
//   memberID: number;
//   name: string;
//   avatar?: string | null | false;
// }

// interface ProjectDetails {
//   id: number;
//   projectCode: string;
//   projectStatusName: string;
//   projectStatusColor: string;
//   access_type_name: string;
//   projectStartDate: string;
//   projectFinishDate: string;
//   projectStage: number;
//   projectMaxStage: number;
//   stagingSystemID: number;

//   address1?: string;
//   address2?: string;
//   address3?: string;
//   postcode?: string;

//   owner: {
//     installerID: number;
//     name: string;
//     companyName: string;
//     email: string;
//     mobile: string;
//     avatar?: string;
//   };

//   projectWarranty: {
//     approved?: {
//       number: string;
//       warrantyType: number;
//       period: number;
//       status: string;
//       downloadURI?: string;
//     };
//     others: WarrantyFile[];
//   } | null;

//   deliveries: any[];
//   projectMembers: ProjectMember[];
// }

// const Project: React.FC<ProjectProps> = ({ projectId, contactId }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [project, setProject] = useState<ProjectDetails | null>(null);
//   const [activeTab, setActiveTab] = useState<"home" | "chat" | "documents" | "orders">("home");

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("access");
//         const res = await axios.post(
//           "https://api-veen-e.ewipro.com/installer/info/",
//           { action: "getProjectDetails", projectID: projectId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data?.status && res.data?.result) {
//           setProject(res.data.result);
//         } else {
//           setError("Nie udało się pobrać danych projektu lub nie znaleziono rezultatu.");
//         }
//       } catch (err: any) {
//         console.error("Błąd pobierania projektu:", err);
//         setError(err.response?.data?.message || "Błąd sieciowy podczas pobierania projektu.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectDetails();
//   }, [projectId, contactId]);

//   if (loading)
//     return (
//       <Box textAlign="center" py={4}>
//         <CircularProgress />
//         <Typography>Ładowanie danych projektu...</Typography>
//       </Box>
//     );

//   if (error)
//     return (
//       <Box textAlign="center" py={4}>
//         <Typography color="error">Błąd: {error}</Typography>
//       </Box>
//     );

//   if (!project)
//     return (
//       <Box textAlign="center" py={4}>
//         <Typography>Projekt nie został znaleziony.</Typography>
//       </Box>
//     );

//   const isMobile = window.innerWidth <= 768;

//   const renderContent = () => {
//     switch (activeTab) {
//       case "home":
//         return (
//           <>
//           <ProjectHeader
//         installer={project.owner.name}
//         startDate={project.projectStartDate}
//         finishDate={project.projectFinishDate}
//         currentStage={project.projectStage}
//         stagingSystemID={project.stagingSystemID}
//         projectCode={project.projectCode}
//         address1={project.address1}
//         address2={project.address2}
//         address3={project.address3}
//         postcode={project.postcode}
//         access_type_name={project.access_type_name}
//         ownerAvatar={project.owner.avatar}
//         ownerId={project.owner.installerID}
//         projectMembers={project.projectMembers.map((m) => ({
//           id: m.memberID,
//           name: m.name,
//           avatar: m.avatar ? String(m.avatar) : null,
//         }))}
//         projectMaxStage={project.projectMaxStage}
//         projectStatusName={project.projectStatusName}
//         approvedWarranty={project.projectWarranty?.approved || null}
//       />
//           <Box
//             display="flex"
//             flexDirection={isMobile ? "column" : "row"}
//             flexWrap="wrap"
//             gap={2}
//             justifyContent="space-between"
//             mt={2}
//             mb={2} // zostawiamy miejsce na pasek
//           >
//             <Box
//               flex={isMobile ? "1 1 100%" : "1 1 400px"}
//               minWidth={isMobile ? "100%" : 400}
//               sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2, display: "flex", flexDirection: "column" }}
//             >
//               <Photos
//                 projectId={project.id}
//                 contactId={Number(contactId)}
//                 isProjectClosed={project.projectStatusName === "Closed"}
//               />
//             </Box>

//             <Box
//               flex={isMobile ? "1 1 100%" : "1 1 500px"}
//               minWidth={isMobile ? "100%" : 500}
//               maxHeight="600px"
//               sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2, display: "flex", flexDirection: "column" }}
//             >
//               <EWIProBoard projectId={projectId} />
//             </Box>

//             <Box
//               flex={isMobile ? "1 1 100%" : "1 1 400px"}
//               minWidth={isMobile ? "100%" : 400}
//               sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2, display: "flex", flexDirection: "column" }}
//             >
//               <Documents projectId={project.id} />
//             </Box>

//             <Box mt={2} width="100%">
//               <DeliveriesList deliveries={project.deliveries} />
//             </Box>
//           </Box>
//           </>
//         );
//       case "chat":
//         return (
//           <Box mt={2} mb={2}>
//             <EWIProBoard projectId={projectId} />
//           </Box>
//         );
//       case "documents":
//         return (
//           <Box mt={2} mb={2}>
//             <Documents projectId={project.id} />
//           </Box>
//         );
//       case "orders":
//         return (
//           <Box mt={2} mb={2}>
//             <Orders projectID={project.id} contactID={Number(contactId)} />
//           </Box>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//   <Box
//   display="flex"
//   flexDirection="column"
//   height="100%" // wysokość całego kontenera projektu
// >
//   {/* Główna zawartość między headerem a paskiem zakładek */}
//   <Box
//   flex={1} // zajmuje pozostałą przestrzeń
//   sx={{
//     overflowY: "auto", 
//     px: 2,
//     // ukrycie scrolla
//     "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
//     scrollbarWidth: "none", // Firefox
//     msOverflowStyle: "none", // IE 10+
//   }}
// >
//   {renderContent()}
// </Box>


//   {/* Pasek zakładek zawsze widoczny na dole */}
//   <Box
//     flexShrink={0} // pasek nie kurczy się
//     sx={{ borderTop: "1px solid #ddd", backgroundColor: "background.paper" }}
//   >
//     <BottomNavigation
//       showLabels
//       value={activeTab}
//       onChange={(event, newValue) => setActiveTab(newValue)}
//     >
//       <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
//       <BottomNavigationAction label="Chat" value="chat" icon={<ChatIcon />} />
//       <BottomNavigationAction label="Documents" value="documents" icon={<DescriptionIcon />} />
//       <BottomNavigationAction label="Orders" value="orders" icon={<ListAltIcon />} />
//     </BottomNavigation>
//   </Box>
// </Box>


//   );
// };

// export default Project;





















































// import React, { useState, useEffect, useRef, JSX } from "react";
// import {
//   Box,
//   CircularProgress,
//   Typography,
//   BottomNavigation,
//   BottomNavigationAction,
// } from "@mui/material";

// import HomeIcon from "@mui/icons-material/Home";
// import ChatIcon from "@mui/icons-material/Chat";
// import DescriptionIcon from "@mui/icons-material/Description";
// import ListAltIcon from "@mui/icons-material/ListAlt";

// import axios from "axios";

// import ProjectHeader from "../common/ProjectHeader";
// import { Documents } from "../common/Documents";
// import { DeliveriesList } from "../common/DeliveriesList";
// import EWIProBoard from "../common/EWIProBoard";
// import { Photos } from "../common/Photos";
// import { Orders } from "../common/Orders";

// interface ProjectProps {
//   projectId: string;
//   contactId: string;
//   onAddressChange?: (addr: string | null) => void;
// }

// interface WarrantyFile {
//   name: string;
//   url: string;
//   date: string;
// }

// interface ProjectMember {
//   memberID: number;
//   name: string;
//   avatar?: string | null | false;
//   userID?: number;
// }

// interface ProjectDetails {
//   id: number;
//   projectCode: string;
//   projectStatusName: string;
//   projectStatusColor: string;
//   access_type_name: string;
//   projectStartDate: string;
//   projectFinishDate: string;
//   projectStage: number;
//   projectMaxStage: number;
//   stagingSystemID: number;

//   address1?: string;
//   address2?: string;
//   address3?: string;
//   postcode?: string;

//   owner: {
//     installerID: number;
//     name: string;
//     companyName: string;
//     email: string;
//     mobile: string;
//     avatar?: string;
//   };

//   projectWarranty: {
//     approved?: {
//       number: string;
//       warrantyType: number;
//       period: number;
//       status: string;
//       downloadURI?: string;
//     };
//     others: WarrantyFile[];
//   } | null;

//   deliveries: any[];
//   projectMembers: ProjectMember[];
// }

// const Project: React.FC<ProjectProps> = ({ projectId, contactId, onAddressChange }) => {
//   // ---- HOOKS: ALWAYS AT TOP ----
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [project, setProject] = useState<ProjectDetails | null>(null);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const [width, setWidth] = useState<number>(1200);

//   const [activeTab, setActiveTab] = useState<string>("home");

//   // ResizeObserver — ALWAYS RUNS, NEVER CONDITIONAL
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const obs = new ResizeObserver((entries) => {
//       const rect = entries[0].contentRect;
//       setWidth(rect.width);
//     });

//     obs.observe(containerRef.current);

//     return () => obs.disconnect();
//   }, []);

//   const isMobile = width <= 768;

//   // Fetch project details
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("access");

//         const res = await axios.post(
//           "https://api-veen-e.ewipro.com/installer/info/",
//           { action: "getProjectDetails", projectID: projectId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data?.status && res.data?.result) {
//           setProject(res.data.result);

//         } else {
//           setError("Nie udało się pobrać danych projektu.");
//         }
        
//       } catch (err: any) {
//         setError("Błąd pobierania projektu.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [projectId]);

//   // Przekazywanie adresu do rodzica gdy zmienia się projekt lub zakładka
//   useEffect(() => {
//     if (onAddressChange && project && activeTab !== "home") {
//       const addr = [project.address1, project.address2, project.address3, project.postcode]
//         .filter(Boolean)
//         .join(", ");
//       onAddressChange(addr || null);
//     } else if (onAddressChange && activeTab === "home") {
//       onAddressChange(null);
//     }
//   }, [project, activeTab, onAddressChange]);

//   // ---- TABS: ALWAYS DEFINED (NO HOOKS HERE) ----
//   let tabs: Array<{ key: string; label: string; icon: JSX.Element }> = [];

//   if (width > 1390) {
//     tabs = [
//       { key: "home", label: "Home", icon: <HomeIcon /> },
//       { key: "orders", label: "Orders", icon: <ListAltIcon /> },
//     ];
//   } else if (width > 1000) {
//     tabs = [
//       { key: "home", label: "Home", icon: <HomeIcon /> },
//       { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
//       { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
//       { key: "orders", label: "Orders", icon: <ListAltIcon /> },
//     ];
//   } else {
//     tabs = [
//       { key: "home", label: "Home", icon: <HomeIcon /> },
//       { key: "chat", label: "Chat", icon: <ChatIcon /> },
//       { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
//       { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
//       { key: "orders", label: "Orders", icon: <ListAltIcon /> },
//     ];
//   }

//   const hasChatTab = tabs.some((t) => t.key === "chat");
//   const hasDocsTab = tabs.some((t) => t.key === "documents");
//   const hasDelivTab = tabs.some((t) => t.key === "deliveries");

//   // ----------------------------
//   // RENDER CONTENT
//   // ----------------------------

//   const renderContent = () => {
//     if (loading)
//       return (
//         <Box textAlign="center" py={4}>
//           <CircularProgress />
//           <Typography>Ładowanie...</Typography>
//         </Box>
//       );

//     if (error)
//       return (
//         <Box textAlign="center" py={4}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       );

//     if (!project)
//       return (
//         <Box textAlign="center" py={4}>
//           <Typography>Projekt nie został znaleziony.</Typography>
//         </Box>
//       );

//     switch (activeTab) {
//       case "home":
//         return (
//           <>
//             <ProjectHeader
//               installer={project.owner?.name ?? ""}
//               startDate={project.projectStartDate}
//               finishDate={project.projectFinishDate}
//               currentStage={project.projectStage}
//               stagingSystemID={project.stagingSystemID}
//               projectCode={project.projectCode}
//               address1={project.address1}
//               address2={project.address2}
//               address3={project.address3}
//               postcode={project.postcode}
//               access_type_name={project.access_type_name}
//               ownerAvatar={project.owner?.avatar}
//               ownerId={project.owner?.installerID}
//               projectMembers={(project.projectMembers ?? []).map((m) => ({
//                 id: m.memberID,
//                 name: m.name,
//                 avatar: m.avatar ? String(m.avatar) : null,
//                 userID: m.userID,
//               }))}
//               projectMaxStage={project.projectMaxStage}
//               projectStatusName={project.projectStatusName}
//               approvedWarranty={project.projectWarranty?.approved || null}
//             />

//             <Box
//               display="flex"
//               flexDirection={isMobile ? "column" : "row"}
//               flexWrap="wrap"
//               gap={2}
//               mt={2}
//               // mb={2}
//             >
//               <Box
//                 flex={isMobile ? "1 1 100%" : "1 1 400px"}
//                 minWidth={isMobile ? "100%" : 400}
//                 sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}
//               >
//                 <Photos
//                   projectId={project.id}
//                   contactId={Number(contactId)}
//                   isProjectClosed={project.projectStatusName === "Closed"}
//                 />
//               </Box>

//               {!hasChatTab && (
//                 <Box
//                   flex={isMobile ? "1 1 100%" : "1 1 500px"}
//                   minWidth={isMobile ? "100%" : 500}
//                   maxHeight="600px"
//                   sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}
//                 >
//                   <EWIProBoard projectId={projectId} />
//                 </Box>
//               )}

//               {!hasDocsTab && (
//                 <Box
//                   flex={isMobile ? "1 1 100%" : "1 1 400px"}
//                   minWidth={isMobile ? "100%" : 400}
//                   sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}
//                 >
//                   <Documents projectId={project.id} />
//                 </Box>
//               )}

//               {!hasDelivTab && (
//                 <Box mt={2} width="100%">
//                   <DeliveriesList deliveries={project.deliveries ?? []} />
//                 </Box>
//               )}
//             </Box>
//           </>
//         );

//       case "chat":
//         return (
//             <EWIProBoard projectId={projectId} />
//         );

//       case "documents":
//         return (
//             <Documents projectId={project.id} />
//         );

//       case "deliveries":
//         return (
//             <DeliveriesList deliveries={project.deliveries ?? []} />
//         );

//       case "orders":
//         return (
//             <Orders projectID={project.id} contactID={Number(contactId)} />
//         );
//     }
//   };

//   return (
//     <Box display="flex" flexDirection="column" height="100%" ref={containerRef}>
//       <Box
//         flex={1}
//         sx={{
//           overflowY: "auto",
//           px: 2,
//           pt: 1,
//           pb: 1,
//           "&::-webkit-scrollbar": { display: "none" },
//           scrollbarWidth: "none",
//         }}
//       >
//         {renderContent()}
//       </Box>

//       <Box sx={{ borderTop: "1px solid #ddd", backgroundColor: "background.paper" }}>
//         <BottomNavigation
//           showLabels
//           value={activeTab}
//           onChange={(e, v) => setActiveTab(v)}
//         >
//           {tabs.map((t) => (
//             <BottomNavigationAction key={t.key} label={t.label} value={t.key} icon={t.icon} />
//           ))}
//         </BottomNavigation>
//       </Box>
//     </Box>
//   );
// };

// export default Project;











import React, { useState, useEffect, useRef, JSX } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import ListAltIcon from "@mui/icons-material/ListAlt";

import axios from "axios";

import ProjectHeader from "../common/ProjectHeader";
import { Documents } from "../common/Documents";
import { DeliveriesList } from "../common/DeliveriesList";
import EWIProBoard from "../common/EWIProBoard";
import { Photos } from "../common/Photos";
import { Orders } from "../common/Orders";

interface ProjectProps {
  projectId: string;
  contactId: string;
  onAddressChange?: (addr: string | null) => void;
}

interface WarrantyFile {
  name: string;
  url: string;
  date: string;
}

interface ProjectMember {
  memberID: number;
  name: string;
  avatar?: string | null | false;
  userID?: number;
}

interface ProjectDetails {
  id: number;
  projectCode: string;
  projectStatusName: string;
  projectStatusColor: string;
  access_type_name: string;
  projectStartDate: string;
  projectFinishDate: string;
  projectStage: number;
  projectMaxStage: number;
  stagingSystemID: number;

  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;

  owner: {
    installerID: number;
    name: string;
    companyName: string;
    email: string;
    mobile: string;
    avatar?: string;
  };

  projectWarranty: {
    approved?: {
      number: string;
      warrantyType: number;
      period: number;
      status: string;
      downloadURI?: string;
    };
    others: WarrantyFile[];
  } | null;

  deliveries: any[];
  projectMembers: ProjectMember[];
}

const Project: React.FC<ProjectProps> = ({ projectId, contactId, onAddressChange }) => {
  // ---- HOOKS: ALWAYS AT TOP ----
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(1200);

  const [activeTab, setActiveTab] = useState<string>("home");

  // ResizeObserver — ALWAYS RUNS, NEVER CONDITIONAL
  useEffect(() => {
    if (!containerRef.current) return;

    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setWidth(rect.width);
    });

    obs.observe(containerRef.current);

    return () => obs.disconnect();
  }, []);

  const isMobile = width <= 768;

  // Fetch project details
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access");

        const res = await axios.post(
          "https://api-veen-e.ewipro.com/installer/info/",
          { action: "getProjectDetails", projectID: projectId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.status && res.data?.result) {
          setProject(res.data.result);

        } else {
          setError("Nie udało się pobrać danych projektu.");
        }
        
      } catch (err: any) {
        setError("Błąd pobierania projektu.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  // Przekazywanie adresu do rodzica gdy zmienia się projekt lub zakładka
  useEffect(() => {
    if (onAddressChange && project && activeTab !== "home") {
      const addr = [project.address1, project.address2, project.address3, project.postcode]
        .filter(Boolean)
        .join(", ");
      onAddressChange(addr || null);
    } else if (onAddressChange && activeTab === "home") {
      onAddressChange(null);
    }
  }, [project, activeTab, onAddressChange]);

  // ---- TABS: ALWAYS DEFINED (NO HOOKS HERE) ----
  let tabs: Array<{ key: string; label: string; icon: JSX.Element }> = [];

  if (width > 1390) {
    tabs = [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  } else if (width > 1000) {
    tabs = [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
      { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  } else {
    tabs = [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "chat", label: "Chat", icon: <ChatIcon /> },
      { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
      { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  }

  const hasChatTab = tabs.some((t) => t.key === "chat");
  const hasDocsTab = tabs.some((t) => t.key === "documents");
  const hasDelivTab = tabs.some((t) => t.key === "deliveries");

  // ----------------------------
  // RENDER CONTENT
  // ----------------------------

  const renderContent = () => {
    if (loading)
      return (
        <Box textAlign="center" py={4}>
          <CircularProgress />
          <Typography>Ładowanie...</Typography>
        </Box>
      );

    if (error)
      return (
        <Box textAlign="center" py={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      );

    if (!project)
      return (
        <Box textAlign="center" py={4}>
          <Typography>Projekt nie został znaleziony.</Typography>
        </Box>
      );

    switch (activeTab) {
      case "home":
        return (
          <>
            <ProjectHeader
              installer={project.owner?.name ?? ""}
              startDate={project.projectStartDate}
              finishDate={project.projectFinishDate}
              currentStage={project.projectStage}
              stagingSystemID={project.stagingSystemID}
              projectCode={project.projectCode}
              address1={project.address1}
              address2={project.address2}
              address3={project.address3}
              postcode={project.postcode}
              access_type_name={project.access_type_name}
              ownerAvatar={project.owner?.avatar}
              ownerId={project.owner?.installerID}
              projectMembers={(project.projectMembers ?? []).map((m) => ({
                id: m.memberID,
                name: m.name,
                avatar: m.avatar ? String(m.avatar) : null,
                userID: m.userID,
              }))}
              projectMaxStage={project.projectMaxStage}
              projectStatusName={project.projectStatusName}
              approvedWarranty={project.projectWarranty?.approved || null}
            />

            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              flexWrap="wrap"
              gap={2}
              mt={2}
            >
              <Box
                flex={isMobile ? "1 1 100%" : "1 1 400px"}
                minWidth={isMobile ? "100%" : 400}
                height={hasChatTab ? "auto" : "600px"}
                sx={{ 
                  borderRadius: 3, 
                  overflow: "hidden", 
                  boxShadow: 2,
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                  <Photos
                    projectId={project.id}
                    contactId={Number(contactId)}
                    isProjectClosed={project.projectStatusName === "Closed"}
                  />
              </Box>

              {!hasChatTab && (
                <Box
                  flex={isMobile ? "1 1 100%" : "1 1 500px"}
                  minWidth={isMobile ? "100%" : 500}
                  height={isMobile ? "auto" : "600px"}
                  sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}
                >
                  <EWIProBoard projectId={projectId} />
                </Box>
              )}

              {!hasDocsTab && (
                <Box
                  flex={isMobile ? "1 1 100%" : "1 1 400px"}
                  minWidth={isMobile ? "100%" : 400}
                >
                  <Documents projectId={project.id} />
                </Box>
              )}

              {!hasDelivTab && (
                <Box mt={2} width="100%">
                  <DeliveriesList deliveries={project.deliveries ?? []} />
                </Box>
              )}
            </Box>
          </>
        );

      case "chat":
        return (
            <EWIProBoard projectId={projectId} />
        );

      case "documents":
        return (
            <Documents projectId={project.id} />
        );

      case "deliveries":
        return (
            <DeliveriesList deliveries={project.deliveries ?? []} />
        );

      case "orders":
        return (
            <Orders projectID={project.id} contactID={Number(contactId)} />
        );
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" ref={containerRef}>
      <Box
        flex={1}
        sx={{
          overflowY: "auto",
          px: 2,
          pt: 1,
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {renderContent()}
      </Box>

      <Box sx={{ borderTop: "1px solid #ddd", backgroundColor: "background.paper" }}>
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
        >
          {tabs.map((t) => (
            <BottomNavigationAction key={t.key} label={t.label} value={t.key} icon={t.icon} />
          ))}
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Project;