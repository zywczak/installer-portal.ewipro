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





























































































import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import Ewistore from "../../assets/ewistore.svg";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface FinanceData {
  status: boolean;
  overdueBalance: string;
  overduePaymentRequired: boolean;
  overusedCreditPaymentRequired: boolean;
  outstandingBalance: string;
  creditLimit: string;
  remainingLimit: string;
  hidden: boolean;
}

const FinanceTiles: React.FC = () => {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const isWide = useMediaQuery("(min-width:520px)");

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const token = localStorage.getItem("access");
        console.log("Fetched token:", token); // Debugging line
        if (!token) return;

        const response = await axios.post(
          "https://api-veen-e.ewipro.com/installer/info/",
          { action: "getUserFinanceData" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching finance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!data || data.hidden) return null;

  // obliczenia wartości
  const remaining = parseFloat(data.remainingLimit);
  const spent = parseFloat(data.outstandingBalance);
  const overdueAmount = parseFloat(data.overdueBalance);

  // kolory
  const GREEN = "#4CAF50";
  const LIGHT_RED = "#EF5350"; // jasno-czerwony
  const DARK_RED = "#D32F2F"; // ciemno-czerwony

  // dane wykresu - logika:
  // - jeśli jest kwota przeterminowana, pokrywa ona część "used"
  // - zielony to zawsze remaining
  let chartData: { name: string; value: number }[];
  let colors: string[];

  if (overdueAmount > 0) {
    // mamy kwotę przeterminą - używamy ciemno-czerwonego na jej pokrycie
    const usedWithoutOverdue = Math.max(0, spent - overdueAmount);
    chartData = [
      { name: "Used", value: usedWithoutOverdue },
      { name: "Overdue", value: overdueAmount },
      { name: "Remaining", value: remaining },
    ];
    colors = [LIGHT_RED, DARK_RED, GREEN];
  } else {
    // brak kwoty przeterminowanej - standardowy wykres
    chartData = [
      { name: "Used", value: spent },
      { name: "Remaining", value: remaining },
    ];
    colors = [LIGHT_RED, GREEN];
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card
        elevation={0}
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
            {/* Pie Chart */}
<Box sx={{ width: 200, height: 200, position: "relative" }}>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={chartData}
        innerRadius="65%"
        outerRadius="95%"
        paddingAngle={1}
        dataKey="value"
        stroke="none"
        strokeWidth={0}
        startAngle={90}
        endAngle={450}
        cornerRadius={6}
      >
        {chartData.map((entry, index) => (
          <Cell key={index} fill={colors[index]} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>

              <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  }}
>
  <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}> {/* zmniejszone z 1.75rem */}
    £{data.creditLimit}
  </Typography>
  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}> {/* zmniejszone */}
    {t("views.dashboard.statements.assumedCreditLimit")}
  </Typography>
</Box>

            </Box>
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 1.5, // trochę mniejszy odstęp
  }}
>
  {/* Remaining Credit Limit */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
    <Box
      sx={{ width: 16, height: 16, backgroundColor: GREEN, borderRadius: "50%" }} // mniejsze kółko
    />
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
        £{remaining.toFixed(2)}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
        {t("views.dashboard.statements.remainingCreditLimit")}
      </Typography>
    </Box>
  </Box>

  {/* Used (Outstanding Balance) */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
    <Box
      sx={{ width: 16, height: 16, backgroundColor: LIGHT_RED, borderRadius: "50%" }}
    />
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
        £{spent.toFixed(2)}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
        {t("views.dashboard.statements.outstandingBalance")}
      </Typography>
    </Box>
  </Box>

  {/* Overdue Amount */}
  {overdueAmount > 0 && (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
      <Box
        sx={{ width: 16, height: 16, backgroundColor: DARK_RED, borderRadius: "50%" }}
      />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
          £{overdueAmount.toFixed(2)}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
          {t("views.dashboard.statements.overdueAmount")}
        </Typography>
      </Box>
    </Box>
  )}
</Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinanceTiles;
