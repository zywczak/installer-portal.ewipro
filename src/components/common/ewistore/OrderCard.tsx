// import React from "react";
// import { Box, Card, Typography, Chip } from "@mui/material";
// import { OrderItem, QuoteItem, ProformaItem } from "./types";
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import TakeoutDiningOutlinedIcon from '@mui/icons-material/TakeoutDiningOutlined';

// interface OrderCardProps {
//   order?: OrderItem;
//   quote?: QuoteItem | ProformaItem;
//   onClick: (item: OrderItem | QuoteItem | ProformaItem) => void;
// }

// export const OrderCard: React.FC<OrderCardProps> = ({ order, quote, onClick }) => {
//   const isOrder = !!order;
//   const isProforma = !!order && order.orderType === "proforma";
//   const item = order || quote!;
//   const date = item.date;
//   const totalNet = item.totalNet;
//   const itemsCount = item.itemsCount;

//   let title: string;
//   let id: number;
//   let chipLabel: string;
//   let chipStyle: { backgroundColor: string; color: string };

//   if (isOrder && !isProforma) {
//     // Normalny Order
//     title = "Zamówienie";
//     id = order!.orderNumber;
//     chipLabel = order!.status.label;
//     chipStyle = {
//       backgroundColor: order!.status.backgroundColor,
//       color: order!.status.fontColor
//     };
//   } else if (isProforma) {
//     // Proforma traktowana jako order z innym tytułem
//     title = "Proforma";
//     id = order!.orderNumber;
//     chipLabel = "Proforma";
//     chipStyle = {
//       backgroundColor: "#ede7f6",
//       color: "#673ab7"
//     };
//   } else {
//     // Quote
//     const q = quote as QuoteItem;
//     id = q.id;
//     title = q.quoteType; // Quote lub Draft
//     chipLabel = q.quoteType;
//     chipStyle = {
//       backgroundColor: (q as any).tooltipBackgroundColor || "#e0e0e0",
//       color: (q as any).tooltipFontColor || "#000000"
//     };
//   }

//   return (
//     <Card
//       onClick={() => onClick(item)}
//       sx={{
//         flex: "1 1 250px",
//         mb: 2,
//         p: 2,
//         borderRadius: 3,
//         boxShadow: 1,
//         cursor: "pointer",
//         border: "1px solid #eee",
//         "&:hover": { boxShadow: 3 },
//         opacity: !isOrder && (quote as QuoteItem)?.sold ? 0.7 : 1
//       }}
//     >
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//         <Box display="flex" alignItems="center" gap={1}>
//           {isOrder && !isProforma ? (
//             <TakeoutDiningOutlinedIcon fontSize="small" />
//           ) : (
//             <ReceiptLongIcon fontSize="small" />
//           )}
//           <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#888" }}>
//             {date}
//           </Typography>
//         </Box>

//         <Chip
//           label={chipLabel}
//           size="small"
//           sx={{
//             ...chipStyle,
//             fontWeight: 600,
//             borderRadius: "4px"
//           }}
//         />
//       </Box>

//       <Typography variant="h6" sx={{ fontWeight: 700 }}>
//         {title} #{id}
//       </Typography>

//       <Box display="flex" justifyContent="space-between" mt={1}>
//         <Typography variant="body2" color="textSecondary">
//           {itemsCount} pozycji
//         </Typography>
//         <Typography variant="body2" color="textSecondary">
//           Total Net: <Box component="span" fontWeight="bold">£{totalNet}</Box>
//         </Typography>
//       </Box>
//     </Card>
//   );
// };
import React from "react";
import { Box, Card, Typography, Chip } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TakeoutDiningOutlinedIcon from '@mui/icons-material/TakeoutDiningOutlined';

interface OrderCardProps {
  order?: any;
  quote?: any;
  onClick: (item: any) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, quote, onClick }) => {
  const isOrder = !!order;
  const item = order || quote!;
  const title = isOrder ? (order.orderType === "proforma" ? "Proforma" : "Order") : quote.quoteType;
  const id = isOrder ? order.orderNumber : quote.id;
  const chipLabel = isOrder ? order.status.label : quote.quoteType;
  const chipStyle = isOrder ? {
    backgroundColor: order.status.backgroundColor,
    color: order.status.fontColor
  } : {
    backgroundColor: quote.tooltipBackgroundColor || "#e0e0e0",
    color: quote.tooltipFontColor || "#000000"
  };
  const date = item.date;
  const totalNet = item.totalNet;
  const itemsCount = item.itemsCount;

  return (
    <Card
      onClick={() => onClick(item)}
      sx={{
        flex: "1 1 250px",
        mb: 2,
        p: 2,
        borderRadius: 3,
        boxShadow: 1,
        cursor: "pointer",
        border: "1px solid #eee",
        "&:hover": { boxShadow: 3 },
        opacity: !isOrder && (quote as any)?.sold ? 0.7 : 1
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          {isOrder && order.orderType !== "proforma" ? (
            <TakeoutDiningOutlinedIcon fontSize="small" />
          ) : (
            <ReceiptLongIcon fontSize="small" />
          )}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#888" }}>
            {date}
          </Typography>
        </Box>

        <Chip
          label={chipLabel}
          size="small"
          sx={{ ...chipStyle, fontWeight: 600, borderRadius: "4px" }}
        />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title} #{id}
      </Typography>

      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">{itemsCount} items</Typography>
        <Typography variant="body2" color="textSecondary">
          Total Net: <Box component="span" fontWeight="bold">£{totalNet}</Box>
        </Typography>
      </Box>
    </Card>
  );
};
