import React, { useState } from "react";
import { 
  Box, Typography, List, Card, Chip, Divider, Dialog, IconButton, Link, 
  Pagination,
  Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DescriptionIcon from "@mui/icons-material/Description";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import InboxIcon from "@mui/icons-material/Inbox";
import EmptyStateBox from "./EmptyStateBox";

interface DeliveryProduct {
  id: number;
  productCode: string;
  description: string;
  productPhotoURI?: string;
  quantity: number;
  pickedUpQty: number;
  productUnitSize?: string;
  variationCode?: string;
  rate?: string;
}

interface DeliveryItem {
  deliveryID: number;
  date: string;
  time: string;
  courierName?: string;
  trackingNumber?: string;
  trackingLink?: string;
  scheduledLabel?: string;
  scheduledDate?: string;
  status: {
    label: string;
    fontColor: string;
    borderColor: string;
    accentColor?: string;
  };
  items: DeliveryProduct[];
}

interface DeliveriesListProps {
  deliveries: DeliveryItem[];
}

export const ProductDetail: React.FC<{ item: DeliveryProduct }> = ({ item }) => (
  <Box 
    key={item.id} 
    sx={{ 
      display: 'flex', 
      gap: 2, 
      alignItems: 'flex-start', 
      mb: 1.5, 
      p: 2, 
      border: '1px solid #eee',
      borderRadius: 2,
      bgcolor: '#fafafa',
    }}
  >
    <Box 
      component="img" 
      src={item.productPhotoURI || 'placeholder_for_no_image.png'} 
      alt={item.description} 
      sx={{ 
        width: 60, 
        height: 60, 
        objectFit: 'contain',
        borderRadius: 1,
      }} 
    />

    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {item.description}
      </Typography>

      <Typography variant="caption" color="text.secondary" display="block">
        Kod: {item.productCode}
      </Typography>

      {item.variationCode && (
        <Typography variant="caption" color="text.secondary" display="block">
          {item.variationCode}
        </Typography>
      )}
    </Box>

    <Box sx={{ textAlign: 'right' }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Ilość
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {item.quantity}
      </Typography>
    </Box>
  </Box>
);

const getStatusColors = (statusLabel: string) => {
  switch (statusLabel.toLowerCase()) {
    case "created":
      return { bg: "#ffd6d6", color: "#b00000" };
    case "packed":
      return { bg: "#d6e0ff", color: "#003399" };
    case "delivered":
      return { bg: "#d6ffd6", color: "#007700" };
    default:
      return { bg: "#f0f0f0", color: "#555555" };
  }
};

const DeliveryCard: React.FC<{ delivery: DeliveryItem; onClick: (delivery: DeliveryItem) => void }> = ({ delivery, onClick }) => {
  const { bg, color } = getStatusColors(delivery.status.label);

  return (
    <Card 
      onClick={() => onClick(delivery)}
      sx={{ 
        flex: "1 1 250px" ,
        mb: 2, p: 2, borderRadius: 3, boxShadow: 1, cursor: 'pointer', border: '1px solid #eee',
        '&:hover': { boxShadow: 3 }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box display="flex" alignItems="center" gap={1} color="primary.main">
          <LocalShippingIcon sx={{ color: '#8e8e8eff' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#8e8e8eff' }}>{delivery.scheduledDate || delivery.date}</Typography>
        </Box>
        <Chip 
          label={delivery.status.label}
          size="small"
          sx={{
            backgroundColor: bg,
            color: color,
            fontWeight: 600,
            borderRadius: '4px'
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>Dostawa #{delivery.deliveryID}</Typography>
      <Typography variant="body2" color="textSecondary">{delivery.items.length} przedmiot</Typography>
    </Card>
  );
};

const InfoLine: React.FC<{ icon: React.ReactNode; label?: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <Box 
    display="flex" 
    alignItems="center"
    sx={{ py: 0.5 }}
  >
    <Box sx={{ color: "grey.500", fontSize: 28, mr: 1.5 }}>
      {React.cloneElement(icon as any, { fontSize: "inherit" })}
    </Box>

    {label ? (
      <>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600, 
            color: "text.secondary",
            // fontSize: "1rem",
            mr: 1
          }}
        >
          {label}
        </Typography>

        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: "1rem" }}>
          {value}
        </Typography>
      </>
    ) : (
      <Typography variant="body1" sx={{ fontWeight: 600,fontSize: "1rem" }}>
        {value}
      </Typography>
    )}
  </Box>
);



  interface DeliveriesListProps {
  deliveries: DeliveryItem[];
}

const ITEMS_PER_PAGE = 12;

export const DeliveriesList: React.FC<DeliveriesListProps> = ({ deliveries }) => {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
  const [page, setPage] = useState(1);

  const openDialog = (delivery: DeliveryItem) => setSelectedDelivery(delivery);
  const closeDialog = () => setSelectedDelivery(null);

  const pageCount = Math.ceil(deliveries.length / ITEMS_PER_PAGE);
  const deliveriesToShow = deliveries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box p={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
      <Box display="flex" alignItems="center" mb={2}>
        <Inventory2Icon sx={{ mr: 1, color: '#D9B99B', fontSize: 32 }} />
        <Typography fontWeight="bold" variant="h6">
          Dostawy ({deliveries.length})
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {deliveries.length === 0 ? (
        <Box pr={2}>
        <EmptyStateBox
        icon={<InboxIcon />}
        text={"Brak zarejestrowanych dostaw dla tego projektu."}
      />
      </Box>
      ) : (
        <>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {deliveriesToShow.map((delivery) => (
              <DeliveryCard key={delivery.deliveryID} delivery={delivery} onClick={openDialog} />
            ))}
          </Box>

          {pageCount > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                 sx={{
    "& .MuiPaginationItem-root.Mui-selected": {
      backgroundColor: "#54A852",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#397838ff",
      }
    }
  }}
              />
            </Box>
          )}
        </>
      )}

      <Dialog 
        open={!!selectedDelivery} 
        onClose={closeDialog} 
        fullWidth 
        maxWidth="sm" 
        slotProps={{
          paper : {sx: { 
            borderRadius: 3,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
      >
        {selectedDelivery && (
  <>
    {/* =======================================
      HEADER
    ======================================== */}
    <Box
      sx={{
        p: 3,
        pt: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "divider",
        flexShrink: 0
      }}
    >
      {/* LEWA */}
        <Typography variant="h6" fontWeight={700}>
          Dostawa #{selectedDelivery.deliveryID}
        </Typography>

      {/* PRAWA */}
      <IconButton onClick={closeDialog} size="small">
        <CloseIcon fontSize="medium" sx={{ color: "text.primary" }} />
      </IconButton>
    </Box>

    <Divider sx={{ mx: 3, mb: 3, flexShrink: 0 }} />

    {/* =======================================
      PODSTAWOWE INFORMACJE
    ======================================== */}
    <Box sx={{ px: 3, flexShrink: 0 }}>
      <Stack >
        <InfoLine
          icon={<CalendarTodayIcon fontSize="small" />}
          label="Zaplanowane na"
          value={
            selectedDelivery.scheduledLabel ||
            selectedDelivery.scheduledDate ||
            "-"
          }
        />

        <InfoLine
          icon={<LocalShippingIcon fontSize="small" />}
          label="Kurier"
          value={selectedDelivery.courierName || "Brak (własny transport)"}
        />
        {selectedDelivery.trackingLink && (
        <Box ml={5}>
          <Link
            href={selectedDelivery.trackingLink}
            target="_blank"
            rel="noopener"
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Śledź przesyłkę (Nr: {selectedDelivery.trackingNumber})
          </Link>
        </Box>
      )}

        <InfoLine
          icon={<DescriptionIcon fontSize="small" />}
          label="Zamówienie(a)"
          value={`#${selectedDelivery.deliveryID}`}
        />
      </Stack>
    </Box>

    <Divider sx={{ m: 3, flexShrink: 0 }} />

    {/* =======================================
      LISTA PRODUKTÓW
    ======================================== */}
    <Box sx={{ px: 3, pb: 3, flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box 
        display="flex" 
        alignItems="center" 
        gap={1} 
        mb={2}
        sx={{ flexShrink: 0 }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
          Produkty ({selectedDelivery.items.length})
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pr: 1,
          minHeight: 0,
          "&::-webkit-scrollbar": {
      width: 0,
      height: 0,
    },
    /* Firefox */
    scrollbarWidth: "none",
    /* IE / Edge */
    msOverflowStyle: "none",
  }}
      >
        <List disablePadding>
          {selectedDelivery.items.map((item) => (
            <ProductDetail key={item.id} item={item} />
          ))}
        </List>
      </Box>
    </Box>
  </>
)}

      </Dialog>
    </Box>
  );
};