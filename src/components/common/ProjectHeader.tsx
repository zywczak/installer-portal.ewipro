// import React from "react";
// import { Box, Typography, Avatar, Tooltip, Button } from "@mui/material";
// import StageBar from "./StageBar";
// import CheckIcon from '@mui/icons-material/Check'; // Lub VerifiedIcon, jeśli to bardziej pasuje
// import DownloadIcon from '@mui/icons-material/Download';
// import warranty from '../../assets/warranty.png';
// import DEFAULT_PHOTO from '../../assets/profile-photo.png';

// interface Member {
//   id: number;
//   name: string;
//   avatar?: string | null;
// }

// interface ApprovedWarranty {
//   number: string;
//   warrantyType: number;
//   period: number;
//   status: string;
//   downloadURI?: string;
// }

// interface ProjectHeaderProps {
//   installer: string;
//   startDate: string;
//   finishDate: string;
//   currentStage: number;
//   stagingSystemID: number;
//   projectCode?: string;
//   address1?: string;
//   address2?: string;
//   address3?: string;
//   postcode?: string;
//   access_type_name?: string;
//   ownerAvatar?: string;
//   ownerId?: number;
//   projectMembers?: Member[];
//   projectMaxStage?: number;
//   projectStatusName?: string;
//   approvedWarranty?: ApprovedWarranty | null;
// }

// const ProjectHeader: React.FC<ProjectHeaderProps> = ({
//   installer,
//   startDate,
//   finishDate,
//   currentStage,
//   stagingSystemID,
//   projectCode,
//   address1,
//   address2,
//   address3,
//   postcode,
//   access_type_name,
//   ownerAvatar,
//   ownerId,
//   projectMembers = [],
//   projectMaxStage,
//   projectStatusName,
//   approvedWarranty,
// }) => {
//   const getInitials = (name?: string | null) => {
//   if (!name) return "";
//   const [firstName = "", lastName = ""] = name.split(" ");
//   const firstInitial = firstName[0] || "";
//   const lastInitial = lastName[0] || "";
//   return `${firstInitial}${lastInitial}`.toUpperCase();
// };

//   const showApplyButton =
//   (!approvedWarranty || approvedWarranty.status === "Rejected") &&
//   projectMaxStage !== undefined &&
//   currentStage > projectMaxStage;
//   return (
//     <Box p={3} mt={1} pb={0} mb={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
//      <Box
//   display="inline-flex"
//   flexWrap="wrap"
//   justifyContent="center"
//   alignItems="baseline" // <- wyrównanie do dolnej linii tekstu
//   width="100%"
//   mb={2}
//   mt={-1}
//   textAlign="center"
// >
//             <Typography
//               fontWeight="bold"
//               variant="h6"
//               sx={{ mr: 2, whiteSpace: "nowrap" }}
//             >
//               {postcode}
//             </Typography>
      
//             <Typography
//               color="text.secondary"
//               sx={{ whiteSpace: "normal", fontSize: "14px", }}
//             >
//               {[address1, address2, address3].filter(Boolean).join(", ")}
//             </Typography>
//           </Box>
//       <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
//         {/* Lewa strona: awatary */}
//         <Box display="flex" alignItems="center" flexWrap="wrap">
//           {ownerId && (
//   <Tooltip title={installer}>
//     <Avatar
//       src={
//         ownerAvatar || DEFAULT_PHOTO
//       }
//       sx={{ width: 48, height: 48, cursor: "pointer", ml: 0, mr: 3 }}
//       onClick={() => {
//         window.location.hash = `subcontractor/${ownerId}`;
//       }}
//     >
//     </Avatar>
//   </Tooltip>
// )}

// {projectMembers.map((member) => (
//   <Tooltip key={member.id} title={member.name}>
//     <Avatar
//       src={
//         member.avatar || DEFAULT_PHOTO
//       }
//       sx={{ width: 40, height: 40, cursor: "pointer", ml: -1.2 }}
//       onClick={() => {
//         window.location.hash = `subcontractor/${member.id}`;
//       }}
//     >
//     </Avatar>
//   </Tooltip>
// ))}
//         </Box>

//         {/* Prawa strona: zatwierdzona gwarancja */}
//         {approvedWarranty && approvedWarranty.status !== "Rejected" && (
//         <Box
//   display="flex"
//   alignItems="center"
//   justifyContent="space-between"   // <--- lepsze rozmieszczenie
//   gap={3}                          // <--- WIĘKSZY ODSTĘP MIĘDZY TREŚCIĄ A IKONĄ
//   px={3}                           // <--- trochę większy padding poziomy
//   py={1.8}
//   minWidth="260px"                 // <--- SZERSZY BOX (możesz zmienić np. 300px)
//   bgcolor="#f5f5f5"
//   borderRadius={3}
//   sx={{
//     cursor: "pointer",
//     transition: "0.3s",
//     "&:hover": { bgcolor: "#ebebeb" }
//   }}
//   onClick={() => {
//     if (approvedWarranty.downloadURI) {
//       window.open(approvedWarranty.downloadURI, "_blank");
//     }
//   }}
// >
//   <Box display="flex" alignItems="center" gap={1.5}>
//     <Box
//       width={26}
//       height={26}
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//     >
//       <img
//         src={warranty}
//         alt="Warranty"
//         style={{ width: 26, height: 26, display: "block" }}
//       />
//     </Box>

//     <Box>
//       <Typography
//         variant="h6"
//         fontWeight={700}
//         lineHeight={1.1}
//         sx={{ fontSize: "1rem", color: "#333" }}
//       >
//         Warranty
//       </Typography>
//       <Typography
//         variant="body2"
//         color="#666"
//         lineHeight={1.3}
//         sx={{ fontSize: "0.75rem" }}
//       >
//         {approvedWarranty.number}
//       </Typography>
//     </Box>
//   </Box>

//   <Box
//     width={30}     // <--- minimalnie większe
//     height={30}
//     borderRadius={2}
//     bgcolor="#008100"
//     display="flex"
//     alignItems="center"
//     justifyContent="center"
//   >
//     <DownloadIcon sx={{ color: "white", fontSize: 18 }} />
//   </Box>
// </Box>

//         )}
//       </Box>

//       <StageBar
//         currentStage={currentStage}
//         stagingSystemID={stagingSystemID}
//         finishDate={finishDate}
//         projectMaxStage={projectMaxStage}
//         projectStatusName={projectStatusName}
//       />

     





//       {/* Warunek 2: Wyświetl przycisk "Apply for Warranty" */}
//       {showApplyButton && (
//         <Box 
//             display="flex" 
//             justifyContent="center" 
//             mt={3} // Odsunięcie od StageBar
//             mb={2} // Margines dolny
//         >
//           <Button
//             variant="contained"
//             // Użycie tego samego koloru tła, co w sekcji gwarancji
//             sx={{
//                 bgcolor: '#4CAF50',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 borderRadius: '50px', // Większe zaokrąglenie rogów
//                 padding: '12px 30px', // Większy padding
//                 fontSize: '1.1rem',
//                 '&:hover': {
//                     bgcolor: '#388E3C', // Ciemniejsza zieleń po najechaniu
//                 }
//             }}
//             onClick={() => {
//               // Dodaj tutaj logikę przejścia do formularza wniosku o gwarancję
//               console.log("Applying for warranty...");
//             }}
//           >
//             APPLY FOR WARRANTY
//           </Button>
//         </Box>
//       )}

//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         pt={1}
//         pb={1}
//         gap={2}
//       >
//         <Box flex="0 1 50px" height="1px" bgcolor="#b0b0b0" />

//         <Typography variant="caption" color="text.secondary">
//           Project ID: {projectCode}
//         </Typography>

//         <Box flex="0 1 50px" height="1px" bgcolor="#b0b0b0" />
//       </Box>
//     </Box>

    
//   );
// };

// export default ProjectHeader;









import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Avatar, Tooltip, Button } from "@mui/material";
import StageBar from "./StageBar";
import DownloadIcon from '@mui/icons-material/Download';
import warranty from '../../assets/warranty.png';
import DEFAULT_PHOTO from '../../assets/profile-photo.png';

interface Member {
  id: number;
  name: string;
  avatar?: string | null;
  userID?: number;
}

interface ApprovedWarranty {
  number: string;
  warrantyType: number;
  period: number;
  status: string;
  downloadURI?: string;
}

interface ProjectHeaderProps {
  installer: string;
  startDate: string;
  finishDate: string;
  currentStage: number;
  stagingSystemID: number;
  projectCode?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;
  access_type_name?: string;
  ownerAvatar?: string;
  ownerId?: number;
  projectMembers?: Member[];
  projectMaxStage?: number;
  projectStatusName?: string;
  approvedWarranty?: ApprovedWarranty | null;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  installer,
  startDate,
  finishDate,
  currentStage,
  stagingSystemID,
  projectCode,
  address1,
  address2,
  address3,
  postcode,
  access_type_name,
  ownerAvatar,
  ownerId,
  projectMembers = [],
  projectMaxStage,
  projectStatusName,
  approvedWarranty,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    function checkWrap() {
      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children);
      const firstTop = (children[0] as HTMLElement)?.offsetTop || 0;
      const wrapped = children.some((child: any) => child.offsetTop > firstTop);
      setIsWrapped(wrapped);
    }

    checkWrap();
    window.addEventListener("resize", checkWrap);
    return () => window.removeEventListener("resize", checkWrap);
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    const [firstName = "", lastName = ""] = name.split(" ");
    const firstInitial = firstName[0] || "";
    const lastInitial = lastName[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const showApplyButton =
    (!approvedWarranty || approvedWarranty.status === "Rejected") &&
    projectMaxStage !== undefined &&
    currentStage > projectMaxStage;

  return (
    <Box p={3} mt={1} pb={0} mb={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
      {/* Postcode + Address */}
      <Box
        display="inline-flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="baseline"
        width="100%"
        mb={2}
        mt={-1}
        textAlign="center"
      >
        <Typography fontWeight="bold" variant="h6" sx={{ mr: 2, whiteSpace: "nowrap" }}>
          {postcode}
        </Typography>
        <Typography color="text.secondary" sx={{ whiteSpace: "normal", fontSize: "14px" }}>
          {[address1, address2, address3].filter(Boolean).join(", ")}
        </Typography>
      </Box>

      {/* Avatary + Warranty */}
      <Box
        ref={containerRef}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent={isWrapped ? "center" : "space-between"}
        gap={2}
      >
        {/* Lewa strona: awatary */}
        <Box display="flex" alignItems="center" flexWrap="wrap">
          {ownerId && (
            <Tooltip title={installer}>
              <Avatar
                src={ownerAvatar || DEFAULT_PHOTO}
                sx={{ width: 48, height: 48, cursor: "pointer", ml: 0, mr: 3 }}
                onClick={() => { window.location.hash = `subcontractors/${ownerId}`; }}
              />
            </Tooltip>
          )}

          {projectMembers.map((member) => (
            <Tooltip key={member.id} title={member.name}>
              <Avatar
                src={member.avatar || DEFAULT_PHOTO}
                sx={{ width: 40, height: 40, cursor: "pointer", ml: -1.2 }}
                onClick={() => { window.location.hash = `subcontractors/${member.userID || member.id}`; }}
              />
            </Tooltip>
          ))}
        </Box>

        {/* Prawa strona: zatwierdzona gwarancja */}
        {approvedWarranty && approvedWarranty.status !== "Rejected" && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            px={3}
            py={1.8}
            minWidth="260px"
            bgcolor="#f5f5f5"
            borderRadius={3}
            sx={{
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { bgcolor: "#ebebeb" }
            }}
            onClick={() => {
              if (approvedWarranty.downloadURI) {
                window.open(approvedWarranty.downloadURI, "_blank");
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box width={26} height={26} display="flex" alignItems="center" justifyContent="center">
                <img src={warranty} alt="Warranty" style={{ width: 26, height: 26, display: "block" }} />
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={700} lineHeight={1.1} sx={{ fontSize: "1rem", color: "#333" }}>
                  Warranty
                </Typography>
                <Typography variant="body2" color="#666" lineHeight={1.3} sx={{ fontSize: "0.75rem" }}>
                  {approvedWarranty.number}
                </Typography>
              </Box>
            </Box>

            <Box width={30} height={30} borderRadius={2} bgcolor="#008100" display="flex" alignItems="center" justifyContent="center">
              <DownloadIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
          </Box>
        )}
      </Box>

      {/* Stage Bar */}
      <StageBar
        currentStage={currentStage}
        stagingSystemID={stagingSystemID}
        finishDate={finishDate}
        projectMaxStage={projectMaxStage}
        projectStatusName={projectStatusName}
      />

      {/* Apply for Warranty */}
      {showApplyButton && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#4CAF50',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '50px',
              padding: '12px 30px',
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#388E3C' }
            }}
            onClick={() => console.log("Applying for warranty...")}
          >
            APPLY FOR WARRANTY
          </Button>
        </Box>
      )}

      {/* Project ID */}
      <Box display="flex" alignItems="center" justifyContent="center" pt={1} pb={1} gap={2}>
        <Box flex="0 1 50px" height="1px" bgcolor="#b0b0b0" />
        <Typography variant="caption" color="text.secondary">
          Project ID: {projectCode}
        </Typography>
        <Box flex="0 1 50px" height="1px" bgcolor="#b0b0b0" />
      </Box>
    </Box>
  );
};

export default ProjectHeader;










