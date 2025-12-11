// import React, { useState, useEffect } from "react";
// import { Box, Typography, CircularProgress, IconButton, Stack, Divider } from "@mui/material";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import axios from "axios";
// import { fallbackColors, stageColors } from "./colors";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SuccessSnackbar from "./SuccessSnackbar";
// import ErrorSnackbar from "./ErrorSnackbar";
// import EmptyStateBox from "./EmptyStateBox";

// interface PhotosProps {
//   projectId: number;
//   contactId: number;
//   isProjectClosed: boolean;
// }

// interface PhotoItem {
//   id: string;
//   photo_uri: string;
//   full_uri: string;
//   real_name: string;
//   file_real_path: string;
//   dir: string;
// }

// const IMAGE_OVERLAY_COLOR = "#2D3538";

// export const Photos: React.FC<PhotosProps> = ({ projectId, contactId, isProjectClosed }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [photosByStage, setPhotosByStage] = useState<Record<string, PhotoItem[]>>({});

//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [currentStage, setCurrentStage] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [deleting, setDeleting] = useState(false);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const [uploadPreviewOpen, setUploadPreviewOpen] = useState(false);

//   const [uploadPreview, setUploadPreview] = useState<string | null>(null);
//   const [uploadFile, setUploadFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const getStageColor = (stageNo?: number, index?: number) => {
//     if (stageNo != null) return stageColors[stageNo] ?? fallbackColors;
//     return stageColors[(index ?? 0) + 1] ?? fallbackColors;
//   };

//   const fetchPhotos = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("access");
//       const res = await axios.post(
//         "https://api-veen-e.ewipro.com/installer/info/",
//         {
//           action: "getProjectPhotos",
//           projectID: projectId,
//           contactID: contactId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Fetch photos response:", res.data);

//       if (res.data?.status && res.data?.results) {
//         const grouped: Record<string, PhotoItem[]> = {};
//         res.data.results.forEach((dirObj: any) => {
//           grouped[dirObj.dir] = dirObj.photos.map((p: any) => ({
//             id: p.id,
//             photo_uri: p.photo_uri,
//             full_uri: p.full_uri,
//             real_name: p.real_name,
//             file_real_path: p.file_real_path,
//             dir: dirObj.dir,
//           }));
//         });
//         setPhotosByStage(grouped);
//       } else {
//         setPhotosByStage({});
//       }
//     } catch (err: any) {
//       console.error("❌ Błąd pobierania zdjęć:", err);
//       setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu zdjęć.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {

//   fetchPhotos();
// }, [projectId]);


//   const openLightbox = (stage: string, index: number) => {
//     setCurrentStage(stage);
//     setCurrentIndex(index);
//     setLightboxOpen(true);
//   };

//   useEffect(() => {
//     if (!lightboxOpen) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!currentStage) return;
//       if (e.key === "ArrowLeft") prevPhoto();
//       if (e.key === "ArrowRight") nextPhoto();
//       if (e.key === "Escape") closeLightbox();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [lightboxOpen, currentStage, currentIndex]);

//   const uploadPhoto = async () => {
//   if (!uploadFile) return;

//   setUploading(true);

//   try {
//     const token = localStorage.getItem("access");

//     const formData = new FormData();
//     formData.append("action", "postPhotoToProjectStage");
//     formData.append("projectID", String(projectId));
//     formData.append("contactID", String(contactId));
//     formData.append("photo", uploadFile);

//     const res = await axios.post(
//       "https://api-veen-e.ewipro.com/installer/info/",
//       formData,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     if (!res.data?.status) {
//       throw new Error(res.data?.message || "Upload failed");
//     }

//     // zamiast dodawać "nowe zdjęcie" z odpowiedzi, po prostu pobierz wszystkie zdjęcia jeszcze raz:
//     await fetchPhotos();

//     setUploadFile(null);
//     setUploadPreview(null);
//     setSuccessMsg("Photo uploaded successfully.");

//   } catch (err: any) {
//     console.error("Upload error:", err);
//     setErrorMsg("Error while uploading photo.");
//   } finally {
//     setUploading(false);
//   }
// };


//   const closeLightbox = () => setLightboxOpen(false);

//   const prevPhoto = () => {
//     if (currentStage) {
//       const photos = photosByStage[currentStage];
//       setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
//     }
//   };

//   const nextPhoto = () => {
//     if (currentStage) {
//       const photos = photosByStage[currentStage];
//       setCurrentIndex((currentIndex + 1) % photos.length);
//     }
//   };

//   const handleUploadClick = () => {
//   document.getElementById("photo-upload-input")?.click();
// };

// const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const files = e.target.files;
//   if (!files) return;

//   const jpgFiles = Array.from(files).filter(file =>
//     file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg")
//   );

//   if (jpgFiles.length === 0) {
//     setErrorMsg("Only JPG files are allowed.");
//     return;
//   }

//   if (jpgFiles.length > 15) {
//     setErrorMsg("You can upload maximum 15 files at once.");
//     return;
//   }

//   // Bierzemy tylko pierwsze wybrane zdjęcie do podglądu
//   const file = jpgFiles[0];
//   setUploadFile(file);
//   const previewUrl = URL.createObjectURL(file);
//   setUploadPreview(previewUrl);
//   setUploadPreviewOpen(true);

//   // reset input, żeby można było wybrać ten sam plik ponownie
//   e.target.value = "";
// };




//   const handleDeletePhoto = async () => {
//   if (!currentStage) return;

//   const photos = photosByStage[currentStage];
//   const photo = photos[currentIndex];
//   const token = localStorage.getItem("access");

//   if (!photo) return;

//   setDeleting(true);

//   try {
//     const payload = {
//       action: "deleteProjectPhoto",
//       projectID: projectId,
//       fileRealPath: photo.file_real_path,
//     };

//     console.log("Sending DELETE request with payload:", payload);

//     const res = await axios.post(
//       "https://api-veen-e-test.ewipro.com/installer/info/",
//       payload,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     console.log("Backend response:", res.data);

//     if (!res.data?.status) {
//       throw new Error(res.data?.message || "Backend returned error status");
//     }

//     // Aktualizacja lokalnego stanu
//     setPhotosByStage(prev => {
//       const updated = { ...prev };
//       const updatedStagePhotos = updated[currentStage].filter(p => p.id !== photo.id);

//       if (updatedStagePhotos.length > 0) {
//         updated[currentStage] = updatedStagePhotos;
//       } else {
//         delete updated[currentStage];
//       }

//       return updated;
//     });

//     // Ustawienie nowego indeksu w Lightboxie
//     setCurrentIndex(prevIndex => {
//       const remaining = photos.length - 1;
//       if (remaining === 0) {
//         closeLightbox();
//         return 0;
//       }
//       if (prevIndex >= remaining) return remaining - 1;
//       return prevIndex;
//     });

//     setSuccessMsg("Photo removed successfully.");

//   } catch (err: any) {
//     console.error("Delete error:", err);
//     setErrorMsg(err.response?.data?.message || "Error while deleting photo.");
//   } finally {
//     setDeleting(false);
//   }
// };


//   if (loading) return (
//     <Box textAlign="center" py={4}>
//       <CircularProgress />
//       <Typography>Ładowanie zdjęć...</Typography>
//     </Box>
//   );

//   if (error) return (
//     <Box textAlign="center" py={4}>
//       <Typography color="error">{error}</Typography>
//     </Box>
//   );

//   const sortedStages = Object.keys(photosByStage).sort((a, b) => Number(a) - Number(b));

//   return (
//     <Box p={3} height="100%" borderRadius={3} boxShadow={2} bgcolor="#fff">
//        <input
//   id="photo-upload-input"
//   type="file"
//   accept=".jpg,image/jpeg"
//   style={{ display: "none" }}
//   multiple
//   onChange={handleFilesSelected}
// />

// <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//   <Stack direction="row" alignItems="center" spacing={1}>
//     <PhotoCameraIcon sx={{ color: 'grey', fontSize: 36 }} />
//     <Stack direction="column" spacing={0.2} alignItems="flex-start">
//       <Typography
//         variant="h6"
//         fontWeight="bold"
//         sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
//       >
//         Photos
//       </Typography>
//       <Typography
//         variant="body2"
//         color="text.secondary"
//         sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
//       >
//         EWI Stages Visual Documentation
//       </Typography>
//     </Stack>
//   </Stack>

//   {!isProjectClosed && (
//     <IconButton
//       onClick={handleUploadClick}
//       sx={{
//         backgroundColor: "#E0E0E0",
//         width: 30,
//         height: 30,
//         borderRadius: "25%",
//         "&:hover": { backgroundColor: "#D0D0D0" }
//       }}
//     >
//       <AddIcon fontSize="medium" sx={{ color: "#333" }} />
//     </IconButton>
//   )}
// </Stack>
//       <Divider sx={{ mb: 2 }} />

//       <Stack
//         direction="row"
//         overflow="auto"
//         flexWrap="wrap"
//         gap={2}
//         justifyContent="center"
//         sx={{ width: "100%" }}
//       >
//         {Object.keys(photosByStage).length === 0 ? (
//   <EmptyStateBox
//         icon={<PhotoCameraIcon/>}
//         text="No photos yet"
//         onClick={isProjectClosed ? undefined : handleUploadClick}
//       />
// ) : (
//           sortedStages.map((stage, idx) => {
//   const photos = photosByStage[stage] || [];
//   const previewPhotos = photos.slice(0, 4);
//   const extraCount = photos.length - 4;

//   const color = getStageColor(Number(stage), idx);

//   return (
//     <Box
//       key={stage}
//       sx={{
//         width: 150,
//         height: 150,
//         borderRadius: 2,
//         p: 1,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         border: `3px solid ${color.border}`,
//         bgcolor: color.bg,
//       }}
//     >
//       <Box
//         width="100%"
//         height="100%"
//         display="grid"
//         sx={{
//           background: IMAGE_OVERLAY_COLOR,
//           borderRadius: 1,
//           overflow: "hidden",
//           gridTemplateColumns: previewPhotos.length === 1 ? "1fr" : "1fr 1fr",
//           gridTemplateRows: previewPhotos.length === 1 ? "1fr" : previewPhotos.length === 2 ? "1fr" : "1fr 1fr",
//           gridTemplateAreas:
//             previewPhotos.length === 1 ? `"a"` :
//             previewPhotos.length === 2 ? `"a b"` :
//             previewPhotos.length === 3 ? `"a b" "a c"` : `"a b" "c d"`,
//         }}
//       >
//         {previewPhotos.map((photo, index) => {
//           const isLast = index === previewPhotos.length - 1;
//           const showOverlay = isLast && extraCount > 0;

//           let area = "";
//           if (previewPhotos.length === 1) area = "a";
//           else if (previewPhotos.length === 2) area = index === 0 ? "a" : "b";
//           else if (previewPhotos.length === 3) area = index === 0 ? "a" : index === 1 ? "b" : "c";
//           else area = index === 0 ? "a" : index === 1 ? "b" : index === 2 ? "c" : "d";

//           return (
//             <Box
//               key={photo.id}
//               position="relative"
//               sx={{
//                 cursor: "pointer",
//                 gridArea: area,
//                 overflow: "hidden",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 filter: showOverlay ? "grayscale(80%) brightness(60%)" : "none",
//               }}
//               onClick={() => openLightbox(stage, index)}
//             >
//               <Box
//                 component="img"
//                 src={photo.photo_uri}
//                 alt={photo.real_name}
//                 sx={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   objectPosition: "center",
//                   display: "block",
//                 }}
//               />
//               {showOverlay && (
//                 <Box
//                   position="absolute"
//                   top="50%"
//                   left="50%"
//                   sx={{ transform: "translate(-50%, -50%)" }}
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                   bgcolor="rgba(0,0,0,0.5)"
//                   color="#fff"
//                   fontWeight="bold"
//                   fontSize={20}
//                   borderRadius="50%"
//                   width={50}
//                   height={50}
//                   zIndex={2}
//                 >
//                   +{extraCount}
//                 </Box>
//               )}
//             </Box>
//           );
//         })}
//       </Box>
//       <Typography
//         fontWeight="bold"
//         textAlign="center"
//         mt={1}
//         sx={{
//           fontSize: 16,
//           fontFamily: "'Helvetica Neue', Arial, sans-serif",
//           color: color.color,
//         }}
//       >
//         Stage {stage}
//       </Typography>
//     </Box>
//   );
// })
//         )}
//       </Stack>

//       {lightboxOpen && currentStage && (
//         <Box
//           position="fixed"
//           top={0}
//           left={0}
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0,0,0,0.85)"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           zIndex={9999}
//           onClick={closeLightbox}
//         >
//           <IconButton
//             onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
//             sx={{ position: "absolute", top: 16, right: 16, color: "#fff" }}
//           >
//             <CloseIcon fontSize="large" />
//           </IconButton>

//           <IconButton
//             onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
//             sx={{
//               position: "absolute",
//               left: 0,
//               top: "50%",
//               transform: "translateY(-50%)",
//               width: 60,
//               height: 200,
//               color: "#fff",
//               bgcolor: "rgba(0,0,0,0.1)",
//               borderRadius: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
//             }}
//           >
//             <ArrowBackIosNewIcon fontSize="large" />
//           </IconButton>

//           <Box
//             component="img"
//             src={photosByStage[currentStage][currentIndex].full_uri}
//             alt={photosByStage[currentStage][currentIndex].real_name}
//             sx={{
//               maxHeight: "80%",
//               maxWidth: "90%",
//               borderRadius: 2,
//               objectFit: "contain",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           />

//           <IconButton
//             onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
//             sx={{
//               position: "absolute",
//               right: 0,
//               top: "50%",
//               transform: "translateY(-50%)",
//               width: 60,
//               height: 200,
//               color: "#fff",
//               bgcolor: "rgba(0,0,0,0.1)",
//               borderRadius: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
//             }}
//           >
//             <ArrowForwardIosIcon fontSize="large" />

//           </IconButton>

//                       <IconButton
//   onClick={(e) => {
//     e.stopPropagation();
//     setConfirmDeleteOpen(true);
//   }}
//   sx={{
//     position: "absolute",
//     top: 10,
//     right: "50%",
//     transform: "translateX(50%)",
//     color: "#fff",
//     bgcolor: "rgba(0,0,0,0.4)",
//     "&:hover": { bgcolor: "rgba(0,0,0,0.7)" }
//   }}
// >
//   <DeleteIcon fontSize="large" />
// </IconButton>
// <SuccessSnackbar
//   message={successMsg}
//   onClose={() => setSuccessMsg(null)}
//   sidebarWidth={0}
// />

// <ErrorSnackbar
//   message={errorMsg}
//   onClose={() => setErrorMsg(null)}
//   sidebarWidth={0}
// />
//         </Box>
//       )
//       }
      
//             {confirmDeleteOpen && (
//         <Box
//           position="fixed"
//           top={0}
//           left={0}
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0,0,0,0.65)"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           zIndex={10000}
//           onClick={() => setConfirmDeleteOpen(false)}
//         >
//           <Box
//             onClick={(e) => e.stopPropagation()}
//             bgcolor="#fff"
//             p={3}
//             borderRadius={2}
//             width={300}
//             textAlign="center"
//             boxShadow={4}
//           >
//             <Typography variant="h6" fontWeight="bold" mb={1}>
//               Remove photo?
//             </Typography>

//             <Typography mb={3} sx={{ opacity: 0.8 }}>
//               Do you really want to remove photo?
//             </Typography>

//             <Stack direction="row" justifyContent="space-between">
//               <IconButton
//                 onClick={() => setConfirmDeleteOpen(false)}
//                 sx={{
//                   flex: 1,
//                   mr: 1,
//                   borderRadius: 1,
//                   bgcolor: "#ddd",
//                   "&:hover": { bgcolor: "#ccc" }
//                 }}
//               >
//                 <Typography fontWeight="bold">Cancel</Typography>
//               </IconButton>

//               <IconButton
//                 onClick={async () => {
//                   await handleDeletePhoto();
//                   setConfirmDeleteOpen(false);
//                 }}
//                 sx={{
//                   flex: 1,
//                   ml: 1,
//                   borderRadius: 1,
//                   bgcolor: "#e53935",
//                   color: "#fff",
//                   "&:hover": { bgcolor: "#d32f2f" }
//                 }}
//               >
//                 <Typography fontWeight="bold">Yes, remove</Typography>
//               </IconButton>
//             </Stack>
//           </Box>
//         </Box>
//       )}
//      {uploadPreview && uploadPreviewOpen && (
//   <Box
//     position="fixed"
//     top={0}
//     left={0}
//     width="100vw"
//     height="100vh"
//     bgcolor="rgba(0,0,0,0.85)"
//     display="flex"
//     alignItems="center"
//     justifyContent="center"
//     zIndex={10000}
//     onClick={() => setUploadPreviewOpen(false)}
//   >
//     <Box
//       onClick={(e) => e.stopPropagation()}
//       bgcolor="#fff"
//       p={2}
//       borderRadius={2}
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       maxWidth={400}
//       width="90%"
//       boxShadow={4}
//     >
//       <Typography fontWeight="bold" mb={1}>Preview</Typography>

//       <Box
//         component="img"
//         src={uploadPreview}
//         alt="preview"
//         sx={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 2 }}
//       />

//       <Stack direction="row" spacing={2} mt={2}>
//         <IconButton
//           onClick={() => {
//             setUploadFile(null);
//             setUploadPreview(null);
//             setUploadPreviewOpen(false);
//           }}
//           sx={{ bgcolor: "#ddd", "&:hover": { bgcolor: "#ccc" }, borderRadius: 1 }}
//         >
//           <Typography fontWeight="bold">Cancel</Typography>
//         </IconButton>

//         <IconButton
//           disabled={uploading}
//           onClick={async () => {
//             await uploadPhoto();
//             setUploadPreviewOpen(false);
//           }}
//           sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" }, color: "#fff", borderRadius: 1 }}
//         >
//           <Typography fontWeight="bold">
//             {uploading ? "Uploading..." : "Upload"}
//           </Typography>
//         </IconButton>
//       </Stack>
//     </Box>
//   </Box>
// )}

//     </Box>
//   );
// };


























import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, IconButton, Stack, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { fallbackColors, stageColors } from "./colors";
import SuccessSnackbar from "./SuccessSnackbar";
import ErrorSnackbar from "./ErrorSnackbar";
import EmptyStateBox from "./EmptyStateBox";
import PhotoGallery, { PhotoGalleryItem } from "./PhotoGallery";

interface PhotosProps {
  projectId: number;
  contactId: number;
  isProjectClosed: boolean;
}

interface PhotoItem {
  id: string;
  photo_uri: string;
  full_uri: string;
  real_name: string;
  file_real_path: string;
  dir: string;
}

const IMAGE_OVERLAY_COLOR = "#2D3538";

export const Photos: React.FC<PhotosProps> = ({ projectId, contactId, isProjectClosed }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photosByStage, setPhotosByStage] = useState<Record<string, PhotoItem[]>>({});

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [uploadPreviews, setUploadPreviews] = useState<{ file: File; previewUrl: string }[]>([]);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [uploadPreviewOpen, setUploadPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getStageColor = (stageNo?: number, index?: number) => {
    if (stageNo != null) return stageColors[stageNo] ?? fallbackColors;
    return stageColors[(index ?? 0) + 1] ?? fallbackColors;
  };

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access");
      const res = await axios.post(
        "https://api-veen-e.ewipro.com/installer/info/",
        {
          action: "getProjectPhotos",
          projectID: projectId,
          contactID: contactId,
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (res.data?.status && res.data?.results) {
        const grouped: Record<string, PhotoItem[]> = {};
        res.data.results.forEach((dirObj: any) => {
          grouped[dirObj.dir] = dirObj.photos.map((p: any) => ({
            id: p.id,
            photo_uri: p.photo_uri,
            full_uri: p.full_uri,
            real_name: p.real_name,
            file_real_path: p.file_real_path,
            dir: dirObj.dir,
          }));
        });
        setPhotosByStage(grouped);
      } else {
        setPhotosByStage({});
      }
    } catch (err: any) {
      console.error("❌ Błąd pobierania zdjęć:", err);
      setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu zdjęć.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [projectId]);

  const openLightbox = (stage: string, index: number) => {
    setCurrentStage(stage);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  // Konwersja zdjęć dla PhotoGallery
  const getGalleryPhotos = (): PhotoGalleryItem[] => {
    if (!currentStage || !photosByStage[currentStage]) return [];
    
    return photosByStage[currentStage].map(photo => ({
      id: photo.id,
      url: photo.full_uri,
      thumbnailUrl: photo.photo_uri,
      alt: photo.real_name,
    }));
  };

  const handleUploadClick = () => {
    document.getElementById("photo-upload-input")?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const jpgFiles = Array.from(files).filter(file =>
      file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg")
    );

    if (jpgFiles.length === 0) {
      setErrorMsg("Only JPG files are allowed.");
      return;
    }

    if (jpgFiles.length > 15) {
      setErrorMsg("You can upload maximum 15 files at once.");
      return;
    }

    const previews = jpgFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setUploadPreviews(previews);
    setCurrentUploadIndex(0);
    setUploadPreviewOpen(true);

    e.target.value = "";
  };

  const uploadNextPhoto = async () => {
    if (currentUploadIndex >= uploadPreviews.length) {
      setUploadPreviewOpen(false);
      setUploadPreviews([]);
      await fetchPhotos();
      setSuccessMsg("All photos uploaded successfully.");
      return;
    }

    const current = uploadPreviews[currentUploadIndex];
    setUploading(true);

    try {
      const token = localStorage.getItem("access");
      const formData = new FormData();
      formData.append("action", "postPhotoToProjectStage");
      formData.append("projectID", String(projectId));
      formData.append("contactID", String(contactId));
      formData.append("photo", current.file);

      const res = await axios.post(
        "https://api-veen-e.ewipro.com/installer/info/",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data?.status) throw new Error(res.data?.message || "Upload failed");

      setCurrentUploadIndex(prev => prev + 1);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.response?.data?.message || "Error while uploading photo.");
      setCurrentUploadIndex(prev => prev + 1);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: PhotoGalleryItem, index: number) => {
    if (!currentStage) return;

    const photos = photosByStage[currentStage];
    const photoToDelete = photos.find(p => p.id === photo.id);
    const token = localStorage.getItem("access");

    if (!photoToDelete) return;
    setDeleting(true);

    try {
      const payload = {
        action: "deleteProjectPhoto",
        projectID: projectId,
        fileRealPath: photoToDelete.file_real_path,
      };

      const res = await axios.post(
        "https://api-veen-e.ewipro.com/installer/info/",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data?.status) throw new Error(res.data?.message || "Backend returned error status");

      setPhotosByStage(prev => {
        const updated = { ...prev };
        const updatedStagePhotos = updated[currentStage].filter(p => p.id !== photo.id);
        if (updatedStagePhotos.length > 0) updated[currentStage] = updatedStagePhotos;
        else delete updated[currentStage];
        return updated;
      });

      // Jeśli nie ma więcej zdjęć, zamknij lightbox
      if (photos.length === 1) {
        closeLightbox();
      }

      setSuccessMsg("Photo removed successfully.");
    } catch (err: any) {
      console.error("Delete error:", err);
      setErrorMsg(err.response?.data?.message || "Error while deleting photo.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <Box textAlign="center" py={4}>
      <CircularProgress />
      <Typography>Ładowanie zdjęć...</Typography>
    </Box>
  );

  if (error) return (
    <Box textAlign="center" py={4}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  const sortedStages = Object.keys(photosByStage).sort((a, b) => Number(a) - Number(b));

  return (
    <Box p={3} height="100%" borderRadius={3} boxShadow={2} bgcolor="#fff">
      <input
        id="photo-upload-input"
        type="file"
        accept=".jpg,image/jpeg"
        style={{ display: "none" }}
        multiple
        onChange={handleFilesSelected}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PhotoCameraIcon sx={{ color: 'grey', fontSize: 36 }} />
          <Stack direction="column" spacing={0.2} alignItems="flex-start">
            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>Photos</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              EWI Stages Visual Documentation
            </Typography>
          </Stack>
        </Stack>

        {!isProjectClosed && (
          <IconButton
            onClick={handleUploadClick}
            sx={{
              backgroundColor: "#E0E0E0",
              width: 30,
              height: 30,
              borderRadius: "25%",
              "&:hover": { backgroundColor: "#D0D0D0" }
            }}
          >
            <AddIcon fontSize="medium" sx={{ color: "#333" }} />
          </IconButton>
        )}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack
        direction="row"
        overflow="auto"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        sx={{ width: "100%" }}
      >
        {Object.keys(photosByStage).length === 0 ? (
          <EmptyStateBox
            icon={<PhotoCameraIcon />}
            text="No photos yet"
            onClick={isProjectClosed ? undefined : handleUploadClick}
          />
        ) : (
          sortedStages.map((stage, idx) => {
            const photos = photosByStage[stage] || [];
            const previewPhotos = photos.slice(0, 4);
            const extraCount = photos.length - 4;
            const color = getStageColor(Number(stage), idx);

            return (
              <Box
                key={stage}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: `3px solid ${color.border}`,
                  bgcolor: color.bg,
                }}
              >
                <Box
                  width="100%"
                  height="100%"
                  display="grid"
                  sx={{
                    background: IMAGE_OVERLAY_COLOR,
                    borderRadius: 1,
                    overflow: "hidden",
                    gridTemplateColumns: previewPhotos.length === 1 ? "1fr" : "1fr 1fr",
                    gridTemplateRows: previewPhotos.length === 1 ? "1fr" : previewPhotos.length === 2 ? "1fr" : "1fr 1fr",
                    gridTemplateAreas:
                      previewPhotos.length === 1 ? `"a"` :
                        previewPhotos.length === 2 ? `"a b"` :
                          previewPhotos.length === 3 ? `"a b" "a c"` : `"a b" "c d"`,
                  }}
                >
                  {previewPhotos.map((photo, index) => {
                    const isLast = index === previewPhotos.length - 1;
                    const showOverlay = isLast && extraCount > 0;

                    let area = "";
                    if (previewPhotos.length === 1) area = "a";
                    else if (previewPhotos.length === 2) area = index === 0 ? "a" : "b";
                    else if (previewPhotos.length === 3) area = index === 0 ? "a" : index === 1 ? "b" : "c";
                    else area = index === 0 ? "a" : index === 1 ? "b" : index === 2 ? "c" : "d";

                    return (
                      <Box
                        key={photo.id}
                        position="relative"
                        sx={{
                          cursor: "pointer",
                          gridArea: area,
                          overflow: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          filter: showOverlay ? "grayscale(80%) brightness(60%)" : "none",
                        }}
                        onClick={() => openLightbox(stage, index)}
                      >
                        <Box
                          component="img"
                          src={photo.photo_uri}
                          alt={photo.real_name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            display: "block",
                          }}
                        />
                        {showOverlay && (
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            sx={{ transform: "translate(-50%, -50%)" }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bgcolor="rgba(0,0,0,0.5)"
                            color="#fff"
                            fontWeight="bold"
                            fontSize={20}
                            borderRadius="50%"
                            width={50}
                            height={50}
                            zIndex={2}
                          >
                            +{extraCount}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
                <Typography
                  fontWeight="bold"
                  textAlign="center"
                  mt={1}
                  sx={{
                    fontSize: 16,
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    color: color.color,
                  }}
                >
                  Stage {stage}
                </Typography>
              </Box>
            );
          })
        )}
      </Stack>

      {/* Photo Gallery */}
      <PhotoGallery
        photos={getGalleryPhotos()}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onDelete={!isProjectClosed ? handleDeletePhoto : undefined}
        showDeleteButton={!isProjectClosed}
      />

      {/* Upload Preview Queue */}
      {uploadPreviewOpen && uploadPreviews.length > 0 && uploadPreviews[currentUploadIndex] && (
  <Box
    position="fixed"
    top={0}
    left={0}
    width="100vw"
    height="100vh"
    bgcolor="rgba(0,0,0,0.85)"
    display="flex"
    alignItems="center"
    justifyContent="center"
    zIndex={10000}
    onClick={() => setUploadPreviewOpen(false)}
  >
    <Box
      onClick={(e) => e.stopPropagation()}
      bgcolor="#fff"
      p={2}
      borderRadius={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth={400}
      width="90%"
      boxShadow={4}
    >
      <Typography fontWeight="bold" mb={1}>
        Preview ({currentUploadIndex + 1}/{uploadPreviews.length})
      </Typography>

      <Box
        component="img"
        src={uploadPreviews[currentUploadIndex].previewUrl}
        alt="preview"
        sx={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 2 }}
      />

      <Stack direction="row" spacing={2} mt={2}>
        <IconButton
          onClick={() => { setUploadPreviewOpen(false); setUploadPreviews([]); }}
          sx={{ bgcolor: "#ddd", "&:hover": { bgcolor: "#ccc" }, borderRadius: 1 }}
        >
          <Typography fontWeight="bold">Cancel</Typography>
        </IconButton>

        <IconButton
          disabled={uploading}
          onClick={uploadNextPhoto}
          sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" }, color: "#fff", borderRadius: 1 }}
        >
          <Typography fontWeight="bold">{uploading ? "Uploading..." : "Upload"}</Typography>
        </IconButton>
      </Stack>
    </Box>
  </Box>
)}


      <SuccessSnackbar message={successMsg} onClose={() => setSuccessMsg(null)} sidebarWidth={0} />
      <ErrorSnackbar message={errorMsg} onClose={() => setErrorMsg(null)} sidebarWidth={0} />
    </Box>
  );
};
