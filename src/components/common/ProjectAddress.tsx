import React from "react";
import { Box, Typography } from "@mui/material";

interface ProjectAddressProps {
  postcode?: string;
  address1?: string;
  address2?: string;
  address3?: string;
}

const ProjectAddress: React.FC<ProjectAddressProps> = ({
  postcode,
  address1,
  address2,
  address3,
}) => {
  return (
    <Box px={2} py={0.5}  mb={2} maxWidth="100%" display="inline-flex"
      flexWrap="wrap"
      alignItems="center" sx={{ borderTopRightRadius: 16, borderBottomRightRadius: 16, border:"1px solid #cacacaff", borderBottom:"3px solid #2D3538" }} boxShadow={2} bgcolor="#fff">
    {/* <Box
      px={2}
      py={0.5}
      mb={2}
      boxShadow={2}
      bgcolor="#fff"
      display="inline-flex"
      flexWrap="wrap"
      alignItems="center"
      maxWidth="100%"
      border="1px solid #2D3538"
      borderBottom="5px solid #2D3538"
      borderRight="5px solid #2D3538"
      sx={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
    > */}
      <Typography
        fontWeight="bold"
        sx={{ mr: 2, whiteSpace: "nowrap" }}
      >
        {postcode}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ whiteSpace: "normal", fontSize: "12px", }}
      >
        {[address1, address2, address3].filter(Boolean).join(", ")}
      </Typography>
    </Box>
  );
};

export default ProjectAddress;
