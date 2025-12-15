// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import DataTable from "../common/projects&subcontractors/Table/DataTable";
// import axios from "axios";
// import CardList from "../common/projects&subcontractors/List/CardList";
// import UserAvatar from "../common/UserAvatar"; 

// interface Permission {
//   id: number;
//   slug: string;
//   name: string;
//   description: string;
//   type: string;
//   value: boolean;
//   selectOptions: any;
//   testOnly: boolean;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   company?: string;
//   status: "verified" | "not_registered" | "invited";
//   role: string;
//   roleColor?: string;
//   avatar?: string | false;
//   invited: boolean;
//   permissions: Permission[];
//   raw?: any;
// }

// interface SubcontractorsProps {
//   isMobile: boolean;
//   subId?: string | null;
//   onSubcontractorClick?: (id: string) => void;
// }

// const rowStatusColor: Record<User["status"], string> = {
//   verified: "#54A852",
//   invited: "#fbc02d",
//   not_registered: "#9b9b9bff",
// };

// const Subcontractors: React.FC<SubcontractorsProps> = ({
//   isMobile,
//   onSubcontractorClick,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [useTiles, setUseTiles] = useState(false);
//   const [savedWidth, setSavedWidth] = useState<number | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const columns = [
//     {
//       key: "photo",
//       label: "",
//       render: (u: User) => (
//           <UserAvatar
//         avatarUrl={typeof u.avatar === "string" ? u.avatar : undefined}
//         size={40}
//       />
//       ),
//       width: 50,
//     },
//     { key: "name", label: "Name" },
//     { key: "company", label: "Company", render: (u: User) => u.company || "-" },
//     { key: "email", label: "Email" },
//     { key: "phone", label: "Phone" },
//     { key: "role", label: "Role" },
//   ];

//   useEffect(() => {
//   const fetchSubcontractors = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("access");
//       if (!token) {
//         setError("Brak tokena JWT – zaloguj się ponownie.");
//         setLoading(false);
//         return;
//       }

//       const rolesRes = await axios.post(
//         "https://api-veen-e.ewipro.com/installer/info/",
//         { action: "getSubcontractorsRoles" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const roles: { id: number; name: string; accentColor?: string }[] = rolesRes.data?.results || [];

//       const res = await axios.post(
//         "https://api-veen-e.ewipro.com/installer/info/",
//         { action: "getSubcontractorsList", filters: [{ ongoingOnly: true }], sort: "projectIDDESC" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const results = res.data?.results || [];

//       const mapped = results.map((item: any): User => {
//         const role = roles.find((r) => r.id === item.defaultRoleID);
//         return {
//           id: item.userID,
//           name: item.nameSurname || "-",
//           email: item.email || "-",
//           phone: item.mobile || "-",
//           company: item.companyName || "-",
//           status: item.invited ? "invited" : "verified",
//           role: role?.name || "Unknown",
//           roleColor: role?.accentColor || undefined,
//           avatar: item.avatar || false,
//           invited: !!item.invited,
//           permissions: item.permissions || [],
//           raw: item,
//         };
//       });

//       setUsers(mapped);
//     } catch (err: any) {
//       console.error("Błąd pobierania subcontractorów:", err);
//       setError(
//         err.response?.data?.message || "Nie udało się pobrać listy podwykonawców."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchSubcontractors();
// }, []);


//   const handleTableOverflow = (isOverflowing: boolean) => {
//     if (isOverflowing && !useTiles) {
//       setUseTiles(true);
//       if (containerRef.current) setSavedWidth(containerRef.current.offsetWidth);
//     }
//   };

//   const handleRowClick = (user: User) => {
//     if (onSubcontractorClick) {
//       onSubcontractorClick(user.id.toString());
//     } else {
//       window.location.hash = `subcontractors/${user.id}`;
//     }
//   };

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const resizeObserver = new ResizeObserver((entries) => {
//       for (let entry of entries) {
//         const width = entry.contentRect.width;
//         if (useTiles && savedWidth && width >= savedWidth + 1) {
//           setUseTiles(false);
//           setSavedWidth(null);
//         }
//       }
//     });
//     resizeObserver.observe(containerRef.current);
//     return () => resizeObserver.disconnect();
//   }, [useTiles, savedWidth]);

//   if (loading)
//     return (
//       <Box textAlign="center" py={4}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error)
//     return (
//       <Box textAlign="center" py={4}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );

//   return (
//     <Box sx={{ height: "100%", }} ref={containerRef}>
//       {users.length === 0 ? (
//         <Box textAlign="center" py={4}>
//           <Typography color="text.secondary">
//             Nie znaleziono żadnych danych.
//           </Typography>
//         </Box>
//       ) : isMobile || useTiles ? (
//         <CardList
//           type={"subcontractor"}
//           items={users.map((u) => ({
//             id: u.id.toString(),
//             name: u.name,
//             company: u.company,
//             email: u.email,
//             phone: u.phone,
//             role: u.role,
//             roleColor: u.roleColor,
//             status: u.status,
//             avatar: u.avatar || undefined,
//           }))}
//           onItemClick={(item) => handleRowClick({ id: Number(item.id) } as User)}
//         />
//       ) : (
//         <DataTable
//           columns={columns}
//           rows={users}
//           rowKey={(u) => u.id}
//           onHorizontalOverflow={handleTableOverflow}
//           onRowClick={handleRowClick}
//           type={"subcontractor"}
//           getRowStatusColor={(row) => rowStatusColor[row.status]}
//         />
//       )}
//     </Box>
//   );
// };

// export default Subcontractors;
import React, { useRef, useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import SubcontractorsTable from "../common/projects&subcontractors/subcontractors/SubcontractorsTable";
import SubcontractorsCards from "../common/projects&subcontractors/subcontractors/SubcontractorsCards";
import { useSubcontractors } from "../../hooks/useSubcontractors";
import { User } from "../common/projects&subcontractors/subcontractors/types";
import Legend from "../common/projects&subcontractors/Legend";

interface Props {
  isMobile: boolean;
  onSubcontractorClick?: (id: string) => void;
}

const Subcontractors: React.FC<Props> = ({ isMobile, onSubcontractorClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useTiles, setUseTiles] = useState(false);
  const [savedWidth, setSavedWidth] = useState<number | null>(null);

  const { users, loading, error } = useSubcontractors();

  const handleRowClick = (user: User) => {
    if (onSubcontractorClick) onSubcontractorClick(user.id.toString());
    else window.location.hash = `subcontractors/${user.id}`;
  };

  const handleTableOverflow = (isOverflowing: boolean) => {
    if (isOverflowing && !useTiles) {
      setUseTiles(true);
      if (containerRef.current) setSavedWidth(containerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (useTiles && savedWidth && width >= savedWidth + 1) {
          setUseTiles(false);
          setSavedWidth(null);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [useTiles, savedWidth]);

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
  if (error) return <Box textAlign="center" py={4}><Typography color="error">{error}</Typography></Box>;
  if (users.length === 0) return <Box textAlign="center" py={4}><Typography color="text.secondary">Nie znaleziono żadnych danych.</Typography></Box>;

  return (
    <Box sx={{ height: "100%" }} ref={containerRef}>
      <Legend type="subcontractor" />
      {isMobile || useTiles
        ? <SubcontractorsCards users={users} onItemClick={(id) => handleRowClick({ id } as unknown as User)} />
        : <SubcontractorsTable users={users} onRowClick={handleRowClick} onOverflow={handleTableOverflow} />}
    </Box>
  );
};

export default Subcontractors;
