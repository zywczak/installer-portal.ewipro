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
