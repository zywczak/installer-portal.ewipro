import React from "react";
import { Box, Typography, Table as MuiTable, TableBody, TableRow, Divider } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import productImage from "../../assets/nanodrex.png";

interface Product {
  id: string;
  name: string;
  image: string;
  quantity: string;
}

interface ResultsTableProps {
  isMobile?: boolean;
}

const sampleData: Product[] = [
  {
    id: "ROC-470-110",
    name: "Rockwool Dual Density Slab (110mm) - 1x 1.2 x 0.6 0.72m2 / slab",
    image: productImage,
    quantity: "7 packs",
  },
  {
    id: "EWI-225",
    name: "Premium Basecoat / Adhesive 25kg",
    image: productImage,
    quantity: "5 bags",
  },
  {
    id: "PXM-165702",
    name: "Fibreglass Reinforcement Mesh (White) - 165g (White Sticker)",
    image: productImage,
    quantity: "1 rolls",
  },
  {
    id: "WKR-FIXPLUG10-180",
    name: "FIXPLUG10 - PLASTIC FIXING EWI (180MM) - 10MM 200 PIECES",
    image: productImage,
    quantity: "1 boxes",
  },
  {
    id: "EWI-333-7",
    name: "Top Coat Primer - 7kg",
    image: productImage,
    quantity: "1 buckets",
  },
  {
    id: "EWI-075-1A",
    name: "Silicone Render 25kg - 1mm - Base A",
    image: productImage,
    quantity: "1 buckets",
  },
  {
    id: "EXTRA-1",
    name: "Dodatkowy produkt 1",
    image: productImage,
    quantity: "1 szt.",
  },
  {
    id: "EXTRA-2",
    name: "Dodatkowy produkt 2",
    image: productImage,
    quantity: "2 szt.",
  },
  {
    id: "EXTRA-3",
    name: "Dodatkowy produkt 3",
    image: productImage,
    quantity: "3 szt.",
  },
  {
    id: "EXTRA-4",
    name: "Dodatkowy produkt 4",
    image: productImage,
    quantity: "4 szt.",
  },
];

const HeaderCell = styled("th")(({ theme }) => ({
  fontWeight: 400,
  textAlign: "center",
  padding: "12px",
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  fontSize: "14px",
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

const DataCell = styled("td")({
  textAlign: "center",
  padding: "12px",
  fontSize: "14px",
});

const ResultsTable: React.FC<ResultsTableProps> = ({ isMobile = false }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      flex: 1, 
      width: "100%",
      height: isMobile ? "300px" : "457px" 
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "16px"}>
          You require the following items
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ 
        height: isMobile ? 250 : 400, 
        overflowY: "auto", 
        mt: 1 
      }}>
        <MuiTable size={isMobile ? "small" : "medium"} sx={{ borderCollapse: "collapse", width: "100%" }}>
          <colgroup>
            <col style={{ width: isMobile ? "20%" : "15%" }} />
            <col style={{ width: isMobile ? "50%" : "65%" }} />
            <col style={{ width: isMobile ? "30%" : "20%" }} />
          </colgroup>

          <thead>
            <TableRow>
              <HeaderCell>Product</HeaderCell>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Quantity</HeaderCell>
            </TableRow>
          </thead>

          <TableBody>
            {sampleData.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? theme.palette.background.default : "#F5F5F5",
                  cursor: "pointer",
                }}
              >
                <DataCell>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={item.image}
                      alt={item.id}
                      style={{ 
                        maxWidth: isMobile ? 40 : 50, 
                        maxHeight: isMobile ? 40 : 50, 
                        borderRadius: 6 
                      }}
                    />
                  </Box>
                </DataCell>
                <DataCell>
                  <Typography variant="body2" fontWeight={500} fontSize={isMobile ? "12px" : "14px"}>
                    {item.name}
                  </Typography>
                </DataCell>
                <DataCell>
                  <Typography variant="body2" fontSize={isMobile ? "12px" : "14px"}>
                    {item.quantity}
                  </Typography>
                </DataCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </Box>
    </Box>
  );
};

export default ResultsTable;