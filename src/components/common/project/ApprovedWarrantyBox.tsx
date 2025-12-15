import React from "react";
import { Box, Typography } from "@mui/material";
import warranty from '../../../assets/warranty.png';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface ApprovedWarrantyProps {
  approvedWarranty: {
    number: string;
    warrantyType: number;
    period: number;
    status: string;
    downloadURI?: string;
  };
}

const ApprovedWarrantyBox: React.FC<ApprovedWarrantyProps> = ({ approvedWarranty }) => {
  if (!approvedWarranty || approvedWarranty.status !== "Approved") return null;
  console.log(localStorage.getItem("access"));

  const handleClick = () => {
    if (approvedWarranty.downloadURI) {
      window.open(approvedWarranty.downloadURI, "_blank");
    }
  };

  return (
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
        "&:hover": { bgcolor: "#ebebeb" },
      }}
      onClick={handleClick}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box width={24} height={24} display="flex" alignItems="center" justifyContent="center">
          <img src={warranty} alt="Warranty" style={{ width: 24, height: 24, display: "block" }} />
        </Box>

        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            lineHeight={1.1}
            sx={{ fontSize: "1rem", color: "#333" }}
          >
            Warranty
          </Typography>
          <Typography
            variant="body2"
            color="#666"
            lineHeight={1.3}
            sx={{ fontSize: "0.75rem" }}
          >
            GC/EWIPRO/{approvedWarranty.number}
          </Typography>
        </Box>
      </Box>

      <Box
        width={30}
        height={30}
        borderRadius={2}
        bgcolor="#008100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <FileDownloadOutlinedIcon sx={{color: "#fff", fontSize: 18 }} />
      </Box>
    </Box>
  );
};

export default ApprovedWarrantyBox;
