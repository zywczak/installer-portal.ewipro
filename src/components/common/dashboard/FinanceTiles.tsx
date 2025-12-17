// import React, { useEffect, useState } from "react";
// import { Box, Card, CardContent, Typography, CircularProgress, Divider } from "@mui/material";
// import axios from "axios";
// import Ewistore from "../../assets/ewistore.svg";
// import { useTranslation } from 'react-i18next';

// interface FinanceData {
//   status: boolean;
//   overdueBalance: string;
//   overduePaymentRequired: boolean;
//   overusedCreditPaymentRequired: boolean;
//   outstandingBalance: string;
//   creditLimit: string;
//   remainingLimit: string;
//   hidden: boolean;
// }

// const FinanceTiles: React.FC = () => {
//   const [data, setData] = useState<FinanceData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { t, i18n } = useTranslation();

//   useEffect(() => {
//     const fetchFinanceData = async () => {
//       try {
//         const token = localStorage.getItem("access");
//         if (!token) return;

//         const response = await axios.post(
//           "https://api-veen-e.ewipro.com/installer/info/",
//           { action: "getUserFinanceData" },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (response.data) {
//           setData(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching finance data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFinanceData();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//         <CircularProgress size={24} />
//       </Box>
//     );
//   }

//   if (!data || data.hidden) return null;

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 2,
//         p: 2,
//         pt: 4,
//         justifyContent: "flex-start",
//       }}
//     >

// <Card
//   elevation={0}
//   sx={{
//     position: "relative",
//     border: "1px solid #e0e0e0",
//     borderRadius: 2,
//     pt: 2,
//     flex: "1 1 45%",
//     minWidth: 250,
//     overflow: "visible",
//     transition: "0.2s",
//     "&:hover": {
//       borderColor: "#bdbdbd",
//       boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//     },
//   }}
// >
//   <Box
//     sx={{
//       position: "absolute",
//       top: -12,
//       left: 16,
//       backgroundColor: "white",
//     }}
//   >
//     <img src={Ewistore} alt="Ewi Store" style={{ height: "26px" }} />
//   </Box>

//   <CardContent>
//     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//       <Typography variant="body2">{t('views.dashboard.statements.overdueAmount')}</Typography>
//       <Typography
//         variant="body2"
//         sx={{
//           color: parseFloat(data.overdueBalance) > 0 ? "error.main" : "text.primary",
//           fontWeight: "bold",
//         }}
//       >
//         £{data.overdueBalance}
//       </Typography>
//     </Box>

//     <Divider sx={{ my: 1 }} />

//     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//       <Typography variant="body2">{t('views.dashboard.statements.outstandingBalance')}</Typography>
//       <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//         £{data.outstandingBalance}
//       </Typography>
//     </Box>
//   </CardContent>
// </Card>

//       <Card
//         elevation={0}
//         sx={{
//           border: "1px solid #e0e0e0",
//           borderRadius: 2,
//           pt: 2,
//           flex: "1 1 45%",
//           minWidth: 250,
//           transition: "0.2s",
//           "&:hover": {
//             borderColor: "#bdbdbd",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//           },
//         }}
//       >
//         <CardContent>
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//             <Typography variant="body2">{t('views.dashboard.statements.assumedCreditLimit')}</Typography>
//             <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//               £{data.creditLimit}
//             </Typography>
//           </Box>
//           <Divider sx={{ my: 1 }} />
//           <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//             <Typography variant="body2">{t('views.dashboard.statements.remainingCreditLimit')}</Typography>
//             <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//               £{data.remainingLimit}
//             </Typography>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default FinanceTiles;

import React from "react";
import { Box, Card, CardContent, CircularProgress, useMediaQuery } from "@mui/material";
import Ewistore from "../../../assets/ewistore.svg";
import { useFinanceData } from "../../../hooks/useFinanceData";
import { calculateChartData } from "./finances/chartUtils";
import { FinanceChart } from "./finances/FinanceChart";
import { FinanceLegend } from "./finances/FinanceLegend";


const FinanceTiles: React.FC = () => {
  const { data, loading } = useFinanceData();
  const isWide = useMediaQuery("(min-width:520px)");

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!data || data.hidden) return null;

  const chartConfig = calculateChartData(data);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card
        sx={{
          width: "100%",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          px: 2,
          overflow: "visible",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -16,
            left: 16,
            px: 1,
            backgroundColor: "white",
          }}
        >
          <img src={Ewistore} alt="Ewi Store" style={{ height: 32 }} />
        </Box>

        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: isWide ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <FinanceChart data={data} chartConfig={chartConfig} />
            <FinanceLegend data={data} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinanceTiles;