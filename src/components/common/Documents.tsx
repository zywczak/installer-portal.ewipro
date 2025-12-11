  import React, { useEffect, useState } from "react";
  import { 
    Box, Typography, IconButton, Avatar, CircularProgress, Card, Divider,
    Button
  } from "@mui/material";
  import DownloadIcon from "@mui/icons-material/Download";
  import axios from "axios";
  import PersonIcon from "@mui/icons-material/Person";
  import SourceIcon from '@mui/icons-material/Source';
  import AccessTimeIcon from '@mui/icons-material/AccessTime';
  import DescriptionIcon from '@mui/icons-material/Description';
  import InboxIcon from '@mui/icons-material/Inbox';
  import EmptyStateBox from "./EmptyStateBox";

  interface FileItem {
    id: number;
    name: string;
    author: string;
    icon: string;
    url: string;
    stamp: number;
  }

  interface DocumentsProps {
  projectId: number;
  }

  const formatTimestamp = (timestamp: number): string => {
    if (!timestamp || timestamp === 0) return "Brak daty";
    
    try {
      const date = timestamp < 10000000000 
        ? new Date(timestamp * 1000)
        : new Date(timestamp);
      
      return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Błąd formatowania daty:", error);
      return "Nieprawidłowa data";
    }
  };

  const DocumentCard: React.FC<{ file: FileItem; index: number; handleDownload: (url: string, name: string) => void }> = ({ file, index, handleDownload }) => {

    const isAvailable = !!file.url;

    const formattedDate = formatTimestamp(file.stamp);

    return (
  <Card 
    sx={{ 
      p: 0,
      borderRadius: 3,
      boxShadow: 1,
      border: '1px solid #e0e0e0',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* Górna sekcja z ikoną i nazwą */}
  <Box 
    sx={{ 
      p: 2, 
      display: 'flex', 
      alignItems: 'center', 
      backgroundColor: 'transparent',
      pb: 0
    }}
  >
    {/* Ikona pliku */}
    <Box 
      sx={{ 
        backgroundColor: '#3f97dc',
        color: '#fff', 
        borderRadius: 1.5, 
        p: 1, 
        mr: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <DescriptionIcon sx={{ fontSize: 32 }} />
    </Box>

    {/* Tekst */}
    <Box>
      <Typography 
        variant="h6" 
        sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {file.name}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.8rem" }}>
        Investigation No: GC/EWIPRO/{file.id}
        {/* {file.trackingNumber || 'N/A'} */}
      </Typography>
    </Box>

    {/* Ikona pobierania odsunięta na prawo */}
    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <IconButton 
        onClick={() => handleDownload(file.url, file.name)}
        disabled={!isAvailable}
        size="large"
      >
        <DownloadIcon sx={{ fontSize: 26 }} />
      </IconButton>
    </Box>
  </Box>


    {/* Sekcja autora i daty */}
    <Box sx={{ p: 2, flexGrow: 1 }}>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontSize: "0.85rem" }}>
        Form signed by
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2}}>
        <Avatar 
          src={file.icon || undefined} 
          alt={file.author}
          sx={{ width: 40, height: 40 }}
        />
        <Box>
          <Typography 
            variant="body1" 
            sx={{ fontWeight: 700, color: '#4CAF50' }}
          >
            {file.author}
          </Typography>
          <Typography 
            variant="body2" 
            color="textPrimary" 
            sx={{ fontSize: "0.85rem" }}
          >
            {formattedDate}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Card>

    );
  };

  export const Documents: React.FC<DocumentsProps> = ({ projectId }) => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("access");
          const res = await axios.post(
            "https://api-veen-e.ewipro.com/installer/info/",
            { action: "getProjectForms", projectID: projectId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data?.status && res.data?.results) {
            const documents: FileItem[] = res.data.results.map((doc: any) => ({
              id: doc.id,
              name: doc.formName,
              author: doc.authorName,
              icon: doc.icon || "",
              url: doc.pdfURI || "",
              stamp: doc.stamp || null,
            }));
            setFiles(documents);
          } else {
            setFiles([]);
          }
        } catch (err: any) {
          console.error("Błąd pobierania dokumentów:", err);
          setError(err.response?.data?.message || "Błąd sieciowy przy pobieraniu dokumentów.");
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }, [projectId]);

    const handleDownload = (url: string, name: string) => {
      if (url) {
        window.open(url, "_blank");
      } else {
        alert(`Nie można pobrać pliku "${name}". Brakuje adresu URL.`);
      }
    };

    if (loading) {
      return (
        <Box textAlign="center" py={3}>
          <CircularProgress />
          <Typography>Ładowanie dokumentów...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box textAlign="center" py={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    return (
      <Box p={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
        <Box display="flex" alignItems="center" mb={2}>
    <SourceIcon sx={{ mr: 1, color: 'grey', fontSize: 36 }} />
    <Box>
    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      Documents
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
    >
      Download channel
    </Typography>
  </Box>

  </Box>
        <Divider sx={{ mb: 2 }} />

        <Box
    display="flex"
    flexWrap="wrap"
    gap={2}
  >
    {files.length === 0 ? (
      <EmptyStateBox
        icon={<InboxIcon />}
        text={"No documents available"}
      />
    ) : (
      files.map((file, index) => (
        <Box 
          key={index} 
          sx={{ 
            flex: '1 1 320px',
            maxWidth: '100%', 
          }}
        >
          <DocumentCard 
            file={file}
            index={index}
            handleDownload={handleDownload}
          />
        </Box>
      ))
    )}
  </Box>


      </Box>
    );
  };
