// import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
// import { Box, Typography, CircularProgress, useMediaQuery } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import axios from "axios";
// import { fallbackColors, stageColors } from "../colors";
// import EmptyStateBox from "../EmptyStateBox";
// import InboxIcon from '@mui/icons-material/Inbox';

// interface Stage {
// id?: number;
// stageNo?: number;
// stageName: string;
// stageNameShort: string;
// }

// interface StageBarProps {
// currentStage: number;
// stagingSystemID: number;
// finishDate?: string;
// projectMaxStage?: number;
// projectStatusName?: string;
// }

// const StageBar: React.FC<StageBarProps> = ({
// currentStage,
// stagingSystemID,
// finishDate,
// projectMaxStage,
// projectStatusName,
// }) => {
// const [stages, setStages] = useState<Stage[]>([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState<string | null>(null);
// const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);

// const containerRef = useRef<HTMLDivElement>(null);

// // Używamy tylko do wymuszenia mobile przy małym ekranie, ale forceMobile ma priorytet.
// const isMobile = useMediaQuery("(max-width:705px)");

// const [forceMobile, setForceMobile] = useState(false);

// // ---------------------------------------------------
// // FETCH STAGES
// // ---------------------------------------------------
// useEffect(() => {
//   const fetchStages = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("access");
//       const res = await axios.post(
//         "https://api-veen-e.ewipro.com/installer/info/",
//         { action: "getStagingSystemData", stagingSystemID },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data?.status && res.data?.result) {
//         const fetchedStages = res.data.result.map((s: any) => ({
//           id: s.id,
//           stageNo: s.stageNo,
//           stageName: s.stageName,
//           stageNameShort: s.stageNameShort,
//         }));

//         fetchedStages.push({
//           stageName: "Project has been finished",
//           stageNameShort: "Closure",
//         });

//         setStages(fetchedStages);
//       } else {
//         setError("Nie udało się pobrać etapów projektu.");
//       }
//     } catch (err: any) {
//       console.error("❌ Błąd pobierania etapów:", err);
//       setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu etapów.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchStages();
// }, [stagingSystemID, finishDate]);

// // ---------------------------------------------------
// // ROZPOZNANIE MOBILE PRZY SUWANIU WIDOKU
// // ---------------------------------------------------
// useLayoutEffect(() => {
//   if (!containerRef.current || stages.length === 0) return;

//   let debounceTimeout: number;

//   const observer = new ResizeObserver((entries) => {
//     if (!entries.length) return;

//     const width = entries[0].contentRect.width;

//     // REALNA minimalna szerokość kafelka: 195px + ~20px marginesu
//     const tileWidth = 215;
//     const totalWidth = stages.length * tileWidth;

//     // Histereza: dodatkowy margines aby uniknąć mrugania na granicy
//     const hysteresis = 50;
    
//     const shouldBeMobile = forceMobile 
//       ? totalWidth > (width - hysteresis)  // Jeśli mobile, wraca do desktop gdy jest wystarczająco dużo miejsca
//       : totalWidth > (width + hysteresis); // Jeśli desktop, przechodzi do mobile z marginesem

//     // Tylko jeśli stan faktycznie się zmienia
//     if (shouldBeMobile !== forceMobile) {
//       window.clearTimeout(debounceTimeout);
//       debounceTimeout = window.setTimeout(() => {
//         setForceMobile(shouldBeMobile);
//       }, 150);
//     }
//   });

//   observer.observe(containerRef.current);

//   return () => {
//     window.clearTimeout(debounceTimeout);
//     observer.disconnect();
//   };
// }, [stages, forceMobile]);

// const handleStageClick = (index: number) => {
//   setSelectedStageIndex((prev) => (prev === index ? null : index));
// };

// const handleSubmitStage = () => {
//   console.log("Submit stage:", currentStage);
// };

// // ---------------------------------------------------
// // LOADING / ERROR
// // ---------------------------------------------------
// if (loading) return <CircularProgress />;
// if (error) {
// return (
// <Box mt={2} width="calc(100% - 19px)">
//   <EmptyStateBox
//     icon={<InboxIcon />}
//     text={error}
//   />
// </Box>
// );

// }


// // ---------------------------------------------------
// // MOBILE (forceMobile MA PRIORYTET)
// // ---------------------------------------------------
// if (forceMobile || isMobile) {
//   return (
//     <Box ref={containerRef} width="100%" mt={2}>
//       <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
//         {stages.map((stage, index) => {
//           const color = stageColors[index + 1] ?? fallbackColors;
//           const nextColor = stageColors[index + 2] ?? color;

//           const isCompleted = index + 1 < currentStage;
//           const isActive = index + 1 === currentStage;

//           return (
//             <React.Fragment key={index}>
//               <Box
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//                 width={42}
//                 height={42}
//                 borderRadius="50%"
//                 bgcolor={isActive || isCompleted ? color.bg : color.inactiveBg}
//                 color={isActive || isCompleted ? color.color : color.inactiveColor}
//                 fontSize={16}
//                 fontWeight="bold"
//                 border={`3px solid ${
//                   isActive || isCompleted ? color.border : color.inactiveBorder
//                 }`}
//                 sx={{ flexShrink: 0, cursor: "pointer" }}
//                 onClick={() => handleStageClick(index)}
//               >
//                 {isCompleted ? <CheckCircleIcon sx={{ fontSize: 22 }} /> : index + 1}
//               </Box>

//               {index < stages.length - 1 && (
//                 <Box
//                   flexGrow={1}
//                   height={5}
//                   sx={{
//                     background: `linear-gradient(to right, ${color.border}, ${nextColor.inactiveBorder})`,
//                     borderRadius: 2,
//                     marginLeft: "-18px",
//                     marginRight: "-18px",
//                   }}
//                 />
//               )}
//             </React.Fragment>
//           );
//         })}
//       </Box>

//       {selectedStageIndex !== null && (() => {
//         const color = stageColors[selectedStageIndex + 1] ?? fallbackColors;
//         const isCompleted = selectedStageIndex + 1 < currentStage;
//         const isActive = selectedStageIndex + 1 === currentStage;

//         const bg = isActive || isCompleted ? color.bg : color.inactiveBg;
//         const border = isActive || isCompleted ? color.border : color.inactiveBorder;
//         const fontColor = isActive || isCompleted ? color.color : color.inactiveColor;

//         return (
//           <Box
//             p={2}
//             mt={2}
//             borderRadius={2}
//             bgcolor={bg}
//             color={fontColor}
//             border={`1px solid ${border}`}
//           >
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//               <Typography variant="subtitle2" fontWeight="bold">
//                 Stage {stages[selectedStageIndex].stageNo || selectedStageIndex + 1}
//               </Typography>
//               <Box
//                 sx={{ cursor: "pointer", fontWeight: "bold", fontSize: 16 }}
//                 onClick={() => setSelectedStageIndex(null)}
//               >
//                 ✕
//               </Box>
//             </Box>

//             <Typography variant="h6" fontWeight="bold" mb={0.5}>
//               {stages[selectedStageIndex].stageNameShort}
//             </Typography>
//             <Typography variant="body2">{stages[selectedStageIndex].stageName}</Typography>
//           </Box>
//         );
//       })()}

//       {currentStage <= stages.length &&
//         !(projectMaxStage && currentStage > projectMaxStage) &&
//         projectStatusName !== "Closed" && (
//           <Box display="flex" justifyContent="center" mt={3}>
//             <Box
//               onClick={handleSubmitStage}
//               sx={{
//                 bgcolor: "#43a047",
//                 color: "white",
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: "25px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
//               }}
//             >
//               SUBMIT STAGE {currentStage}
//             </Box>
//           </Box>
//         )}
//     </Box>
//   );
// }

// // ---------------------------------------------------
// // DESKTOP VERSION (POPRAWIONA — BEZ WRAPPINGU)
// // ---------------------------------------------------
// return (
//     <Box
//   ref={containerRef}
//   display="flex"
//   flexDirection="row"
//   justifyContent="center"
//   gap={1}
//   mt={2}
//   width="calc(100% - 38px)"

// >
//       {stages.map((stage, index) => {
//         const color = stageColors[index + 1] ?? fallbackColors;

//         const isCompleted = index + 1 < currentStage;
//         const isActive = index + 1 === currentStage;

//         const opacity = !isActive && !isCompleted ? 0.35 : 1;
//         const scale = !isActive && !isCompleted ? 0.92 : 1;

//         return (
//           <Box
//             key={stage.id || `stage-${index}`}
//             sx={{
//               flexGrow: 1,
//               flexBasis: 0,
//               height: "80px",
//               position: "relative",
//               backgroundColor: color.border,
//               boxSizing: "border-box",
//               opacity,
//               transform: `scale(${scale})`,
//               transition: "all 0.3s ease",
//               zIndex: stages.length - index,

//               "&::after": {
//                 content: '""',
//                 position: "absolute",
//                 left: 0,
//                 bottom: 0,
//                 width: 0,
//                 height: 0,
//                 borderLeft: `40px solid ${color.border}`,
//                 borderTop: "40px solid transparent",
//                 borderBottom: "40px solid transparent",
//               },

//               "&::before": {
//                 content: '""',
//                 position: "absolute",
//                 right: "-40px",
//                 bottom: 0,
//                 width: 0,
//                 height: 0,
//                 borderLeft: `40px solid ${color.border}`,
//                 borderTop: "40px solid transparent",
//                 borderBottom: "40px solid transparent",
//               },
//             }}
//           >
//             {/* INNER BOX */}
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: "2px",
//                 bottom: "2px",
//                 left: 0,
//                 right: 0,
//                 paddingLeft: "40px",
//                 paddingRight: "1px",
//                 backgroundColor: color.bg,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",

//                 "&::after": {
//                   content: '""',
//                   position: "absolute",
//                   zIndex: 99,
//                   left: 0,
//                   bottom: "1px",
//                   width: 0,
//                   height: 0,
//                   borderLeft: "37px solid white",
//                   borderTop: "37px solid transparent",
//                   borderBottom: "37px solid transparent",
//                 },

//                 "&::before": {
//                   content: '""',
//                   position: "absolute",
//                   right: "-37px",
//                   bottom: 0,
//                   width: 0,
//                   height: 0,
//                   borderLeft: `38px solid ${color.bg}`,
//                   borderTop: "38px solid transparent",
//                   borderBottom: "38px solid transparent",
//                 },
//               }}
//             >
//               <Box textAlign="center" width="100%">
//                 <Typography fontWeight="bold" fontSize={13} color={color.color} mb={0}>
//                   {index < stages.length - 1 ? `Stage ${index + 1}` : ""}
//                 </Typography>

//                 <Typography
//                   fontWeight="bold"
//                   fontSize={18}
//                   color={color.color}
//                   lineHeight={1}
//                 >
//                   {stage.stageNameShort}
//                 </Typography>

//                 <Typography fontSize={11} color={color.color} lineHeight={1.0}>
//                   {stage.stageName}
//                 </Typography>
//               </Box>
//             </Box>

//             {isActive &&
//               !(projectMaxStage && currentStage > projectMaxStage) &&
//               projectStatusName !== "Closed" &&
//               index < stages.length - 1 && (
//                 <Box position="absolute" top={-15} right={-10} zIndex={99}>
//                   <Box
//                     component="button"
//                     onClick={handleSubmitStage}
//                     sx={{
//                       backgroundColor: "#d9534f",
//                       border: "0px solid",
//                       px: 2,
//                       py: 1,
//                       color: "white",
//                       fontFamily: "'Open Sans', sans-serif",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       cursor: "pointer",
//                       borderRadius: "7px",
//                       transition: "all 0.2s linear 0s",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.2)",

//                       "&:hover": {
//                         backgroundColor: "#c9302c",
//                         boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
//                       },
//                     }}
//                   >
//                     Submit
//                   </Box>
//                 </Box>
//               )}
//           </Box>
//         );
//       })}
//     </Box>
//   );
// };

// export default StageBar;



























// import React, { useEffect, useState } from "react";
// import { Box, CircularProgress, useMediaQuery } from "@mui/material";
// import axios from "axios";
// import EmptyStateBox from "../EmptyStateBox";
// import InboxIcon from '@mui/icons-material/Inbox';
// import StageDesktop from "./StageDesktop";
// import StageMobile from "./StageMobile";

// interface Stage {
//   id?: number;
//   stageNo?: number;
//   stageName: string;
//   stageNameShort: string;
// }

// interface StageBarProps {
//   currentStage: number;
//   stagingSystemID: number;
//   finishDate?: string;
//   projectMaxStage?: number;
//   projectStatusName?: string;
// }

// const StageBar: React.FC<StageBarProps> = ({
//   currentStage,
//   stagingSystemID,
//   finishDate,
//   projectMaxStage,
//   projectStatusName,
// }) => {
//   const [stages, setStages] = useState<Stage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const isMobile = useMediaQuery("(max-width:705px)");

//   useEffect(() => {
//     const fetchStages = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = localStorage.getItem("access");
//         const res = await axios.post(
//           "https://api-veen-e.ewipro.com/installer/info/",
//           { action: "getStagingSystemData", stagingSystemID },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data?.status && res.data?.result) {
//           const fetchedStages = res.data.result.map((s: any) => ({
//             id: s.id,
//             stageNo: s.stageNo,
//             stageName: s.stageName,
//             stageNameShort: s.stageNameShort,
//           }));

//           fetchedStages.push({
//             stageName: "Project has been finished",
//             stageNameShort: "Closure",
//           });

//           setStages(fetchedStages);
//         } else {
//           setError("Nie udało się pobrać etapów projektu.");
//         }
//       } catch (err: any) {
//         console.error(err);
//         setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu etapów.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStages();
//   }, [stagingSystemID, finishDate]);

//   if (loading) return <CircularProgress />;
//   if (error)
//     return (
//       <Box mt={2} width="calc(100% - 19px)">
//         <EmptyStateBox icon={<InboxIcon />} text={error} />
//       </Box>
//     );

//   return isMobile ? (
//     <StageMobile
//       stages={stages}
//       currentStage={currentStage}
//       projectMaxStage={projectMaxStage}
//       projectStatusName={projectStatusName}
//     />
//   ) : (
//     <StageDesktop
//       stages={stages}
//       currentStage={currentStage}
//       projectMaxStage={projectMaxStage}
//       projectStatusName={projectStatusName}
//     />
//   );
// };

// export default StageBar;















import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import axios from "axios";
import EmptyStateBox from "../EmptyStateBox";
import InboxIcon from '@mui/icons-material/Inbox';
import StageDesktop from "./StageDesktop";
import StageMobile from "./StageMobile";

interface Stage {
  id?: number;
  stageNo?: number;
  stageName: string;
  stageNameShort: string;
}

interface StageBarProps {
  currentStage: number;
  stagingSystemID: number;
  finishDate?: string;
  projectMaxStage?: number;
  projectStatusName?: string;
}

const StageBar: React.FC<StageBarProps> = ({
  currentStage,
  stagingSystemID,
  finishDate,
  projectMaxStage,
  projectStatusName,
}) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width:705px)");
  const [forceMobile, setForceMobile] = useState(false);

  // ---------------------------------------------------
  // FETCH STAGES
  // ---------------------------------------------------
  useEffect(() => {
    const fetchStages = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access");
        const res = await axios.post(
          "https://api-veen-e.ewipro.com/installer/info/",
          { action: "getStagingSystemData", stagingSystemID },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.status && res.data?.result) {
          const fetchedStages = res.data.result.map((s: any) => ({
            id: s.id,
            stageNo: s.stageNo,
            stageName: s.stageName,
            stageNameShort: s.stageNameShort,
          }));
          fetchedStages.push({ stageName: "Project has been finished", stageNameShort: "Closure" });
          setStages(fetchedStages);
        } else {
          setError("Nie udało się pobrać etapów projektu.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu etapów.");
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, [stagingSystemID, finishDate]);

  // ---------------------------------------------------
  // USELAYOUTEFFECT – wymuszanie mobile, jak w starym kodzie
  // ---------------------------------------------------
  useLayoutEffect(() => {
    if (!containerRef.current || stages.length === 0) return;
    let debounceTimeout: number;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;

      const width = entries[0].contentRect.width;
      const tileWidth = 215; // dokładnie jak w starym
      const totalWidth = stages.length * tileWidth;
      const hysteresis = 50;

      const shouldBeMobile = forceMobile
        ? totalWidth > (width - hysteresis)
        : totalWidth > (width + hysteresis);

      if (shouldBeMobile !== forceMobile) {
        window.clearTimeout(debounceTimeout);
        debounceTimeout = window.setTimeout(() => setForceMobile(shouldBeMobile), 150);
      }
    });

    observer.observe(containerRef.current);
    return () => {
      window.clearTimeout(debounceTimeout);
      observer.disconnect();
    };
  }, [stages, forceMobile]);

  // ---------------------------------------------------
  // LOADING / ERROR
  // ---------------------------------------------------
  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Box mt={2} width="calc(100% - 19px)">
        <EmptyStateBox icon={<InboxIcon />} text={error} />
      </Box>
    );

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <Box ref={containerRef} width="100%">
      {forceMobile || isMobile ? (
        <StageMobile
          stages={stages}
          currentStage={currentStage}
          projectMaxStage={projectMaxStage}
          projectStatusName={projectStatusName}
        />
      ) : (
        <StageDesktop
          stages={stages}
          currentStage={currentStage}
          projectMaxStage={projectMaxStage}
          projectStatusName={projectStatusName}
        />
      )}
    </Box>
  );
};

export default StageBar;
