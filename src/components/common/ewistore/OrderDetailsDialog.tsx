import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import InTransitIcon from '../../../assets/in_transit.png';
import Delivered from '../../../assets/delivered.png';
import OrderPlaced from '../../../assets/order_placed.png';
import OrderFulfillment from '../../../assets/order_fulfillment.png';
import OrderCancelled from '../../../assets/order_cancelled.png';

interface OrderStatusStep {
  name: string;
  date: string;
  icon: string;
  color: string;
  grayed: boolean;
}

interface Item {
  id: number;
  quantityOriginal: number;
  quantity: number;
  description: string;
  rate: string;
  productCode: string;
  productPhotoURI: string | null;
  children: Item[];
}

interface CreditNote {
  totalNet: string;
  creditNoteNumber: number;
  documentURI: string | null;
}

interface OrderDetails {
  orderNumber: number;
  invoiceID: number;
  totalNet: string;
  documentURI: string | null;
  deliveryCharge: number;
  items: Item[];
  itemsCount: number;
  creditNotes: CreditNote[];
  status: {
    label: string;
    fontColor: string;
    backgroundColor: string;
  };
  shippingLabel: string;
  shippingAddress: {
    line1: string;
    line2: string;
    line3: string;
  } | string;
}

interface OrderDetailsResponse {
  status: boolean;
  orderDetails: OrderDetails;
  orderStatusSteps: OrderStatusStep[];
}

interface OrderItem {
  orderNumber: number;
}

interface OrderDetailsDialogProps {
  order: OrderItem | null;
  projectID: number;
  contactID: number;
  onClose: () => void;
}
// --- Helper Functions (Kept as is) ---

const formatAddress = (address: OrderDetails['shippingAddress']): string => {
  if (typeof address === 'string') return address;
  if (!address) return "Brak adresu";

  const addressParts = [address.line1, address.line2, address.line3].filter(
    part => part && part.trim() !== ""
  );

  return addressParts.length > 0 ? addressParts.join('\n') : "Brak adresu";
};

const mapIconToPNG = (iconName: string) => {
  switch (iconName) {
    case "order-placed-icon":
      return <img src={OrderPlaced} alt="Order placed" width={32} height={32} />;
    case "order-fulfillment-icon":
      return <img src={OrderFulfillment} alt="Order fulfillment" width={32} height={32} />;
    case "in-transit-icon":
      return <img src={InTransitIcon} alt="In transit" width={32} height={32} />;
    case "delivered-icon":
      return <img src={Delivered} alt="Delivered" width={32} height={32} />;
    case "order-cancelled-icon":
      return <img src={OrderCancelled} alt="Order cancelled" width={32} height={32} />;
    default:
      return null;
  }
};

// --- Styled Components ---

const InfoCard: React.FC<{
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  subContent?: React.ReactNode;
}> = ({ title, content, icon, subContent }) => (
  <Box p={2} bgcolor="#f5f5f5" borderRadius={2} flex={1} border="1px solid #e0e0e0">
    
    <Box display="flex" alignItems="center" mb={0.5} color="text.primary" gap={1}>
      {icon && (
        <Box display="flex" alignItems="center" justifyContent="center">
          {icon}
        </Box>
      )}
      <Typography variant="body1" fontWeight={600} fontSize={16}>
        {title}
      </Typography>
    </Box>

    {subContent && <Typography variant="body2" color="text.secondary">{subContent}</Typography>}
    
    {content}
  </Box>
);

const DocumentSection: React.FC<{ label: string; documentNumber: string | number; documentURI: string | null }> = ({ label, documentNumber, documentURI }) => (
  // Styled to resemble the Invoice/Credit Note section in the image
  <Box 
    display="flex" 
    justifyContent="space-between" 
    alignItems="center" 
    p={2} 
    bgcolor="#f5f5f5" 
    borderRadius={2} 
    border="1px solid #e0e0e0" 
    mb={1}
  >
    <Box>
      <Typography variant="body1" fontWeight={600}>{label}</Typography>
      <Typography variant="body2" color="text.secondary">#{documentNumber}</Typography>
    </Box>
    <IconButton
      component={documentURI ? "a" : "button"}
      href={documentURI || undefined}
      target="_blank"
      disabled={!documentURI}
      aria-label={`Pobierz ${label}`}
      sx={{
        // Green background and white icon from the image
        bgcolor: "#4caf50", 
        color: 'white',
        '&:hover': {
          bgcolor: '#388e3c',
        },
        '&.Mui-disabled': {
          bgcolor: '#e0e0e0', // Grey background for disabled
          color: '#a0a0a0', // Grey icon for disabled
        },
      }}
    >
      <DownloadIcon />
    </IconButton>
  </Box>
);

const StatusTimeline: React.FC<{ steps: OrderStatusStep[] }> = ({ steps }) => {

  const cancelIndex = steps.findIndex(s =>
    s.name.toLowerCase().includes("cancelled")
  );

  const visibleSteps =
    cancelIndex !== -1 ? steps.slice(0, cancelIndex + 1) : steps;

  return (
    <Box sx={{ my: 2, p: 2, bgcolor: 'white', borderRadius: 2, border: "1px solid #e0e0e0" }}>
      {visibleSteps.map((step, index) => {

        const isGrayed = step.grayed;

        return (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={index < visibleSteps.length - 1 ? 2 : 0}
            sx={{ opacity: isGrayed ? 0.4 : 1 }}
          >

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mr={2}
              position="relative"
            >
              <Box
                width={32}
                height={32}
                borderRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {mapIconToPNG(step.icon)}
              </Box>

              {index < visibleSteps.length - 1 && (
                <Box
                  position="absolute"
                  top="36px"
                  left="50%"
                  sx={{
                    transform: "translateX(-50%)",
                    width: "2px",
                    height: "calc(100% - 14px)",
                    borderLeft: "1px dashed #e0e0e0"
                  }}
                />
              )}
            </Box>

            <Box>
              <Typography variant="body1" fontWeight={600}>
                {step.name}
              </Typography>
              {step.date && (
                <Typography variant="body2" color="text.secondary">
                  {step.date}
                </Typography>
              )}
            </Box>

          </Box>
        );
      })}
    </Box>
  );
};

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, projectID, contactID, onClose }) => {
  const [details, setDetails] = useState<OrderDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order) return setDetails(null);

    setLoading(true);
    fetch(`https://api-veen-e.ewipro.com/installer/info/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify({
        action: "getOrderDetails",
        projectID,
        contactID,
        orderNumber: order.orderNumber,
      }),
    })
      .then(res => res.json())
      .then(setDetails)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [order, projectID, contactID]);

  if (!order) return null;

  const totalItems = details?.orderDetails?.itemsCount ?? (details?.orderDetails?.items.reduce((acc, item) => acc + item.quantityOriginal, 0) ?? 0);

  return (
  <Dialog 
      open={!!order} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
          sx: { 
            borderRadius: 3,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#fff'
          }
        }}
    >
  <Box
  sx={{
    py: 2,
    px: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    bgcolor: "white"
  }}
>
  <Box>
    <Typography variant="h6" fontWeight={700}>
      Order #{order.orderNumber}
    </Typography>

    {details && (
      <Typography variant="body2" color="text.secondary">
        {totalItems} items • Total Net:{" "}
        <Typography component="span" fontWeight={700} color="text.primary">
          £{details.orderDetails.totalNet}
        </Typography>
      </Typography>
    )}
  </Box>

  <IconButton onClick={onClose} size="small">
    <CloseIcon fontSize="medium" sx={{ color: "text.primary" }} />
  </IconButton>
</Box>

<Divider sx={{ mx: 3, mb: 1 }} />

      {loading ? (
        <DialogContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="center" p={3}>
            <Typography>Ładowanie...</Typography>
          </Box>
        </DialogContent>
      ) : details ? (
        <DialogContent sx={{ p: 2, px: 3, flexGrow: 1, overflowY: 'auto', scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': {
      display: 'none',       // Chrome, Safari, Edge
    }, }}> 
          
          {/* Shipping & Delivery Charge obok siebie */}
          <Box display="flex" gap={2} mb={2}>
            <InfoCard 
              title="Shipping" 
              icon={<LocalShippingIcon />} // Removed icon from InfoCard title area
              subContent="Delivery"
              content={<Typography fontWeight={600} color="text.primary"></Typography>} // Content intentionally left minimal to mimic image
            />
            <InfoCard 
              title="Delivery Charge" 
              icon={<PaymentIcon />}
              subContent={`£${details.orderDetails.deliveryCharge.toFixed(2)}`} 
              content={<Typography fontWeight={600} color="text.primary"></Typography>} // Content intentionally left minimal to mimic image
            />
          </Box>

          {/* Shipping Address */}
          <Box p={2} bgcolor="#f5f5f5" borderRadius={2} mb={2} border="1px solid #e0e0e0">
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOnIcon sx={{ mr: 1, color: "text.primary" }} />
              <Typography variant="body1" fontWeight={600} fontSize={16}>Delivery address</Typography>
            </Box>
            <Typography color="text.secondary" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{formatAddress(details.orderDetails.shippingAddress)}</Typography>
          </Box>

          {/* Documents */}
          <Box mb={2}>
            {details.orderDetails.documentURI && (
              <DocumentSection 
                label="Invoice" 
                documentNumber={details.orderDetails.invoiceID || order.orderNumber} 
                documentURI={details.orderDetails.documentURI} 
              />
            )}
            {details.orderDetails.creditNotes && details.orderDetails.creditNotes.map(creditNote => (
              <DocumentSection 
                key={creditNote.creditNoteNumber} 
                label="Credit Note" 
                documentNumber={creditNote.creditNoteNumber} 
                documentURI={creditNote.documentURI} 
              />
            ))}
          </Box>

          {/* Status Timeline */}
          {details.orderStatusSteps && details.orderStatusSteps.length > 0 && (
            <StatusTimeline steps={details.orderStatusSteps} />
          )}

          {/* Products Section - Not visible in the image, but kept for completeness with minimal styling */}
          {details.orderDetails.items.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={600} mb={2}>
                Produkty
              </Typography>
              {details.orderDetails.items.map((item) => (
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
    </Box>

    <Box sx={{ textAlign: 'right' }}>
  {/* Ilość label */}
  <Typography variant="caption" color="text.secondary" display="block">
    Ilość
  </Typography>

  {/* Jeśli różne → pokaż obie */}
  {item.quantityOriginal !== item.quantity ? (
    <>
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ textDecoration: "line-through" }}
        display="block"
      >
        {item.quantityOriginal}
      </Typography>

      <Typography variant="caption" sx={{ fontWeight: 600 }} display="block">
        {item.quantity}
      </Typography>
    </>
  ) : (
    /* Jeśli takie same → pokaz tylko jedną */
    <Typography variant="caption" sx={{ fontWeight: 600 }} display="block">
      {item.quantity}
    </Typography>
  )}
</Box>

  </Box>
//////////////////////////////////////////// 
            ))}
            </>
          )}
        </DialogContent>
      ) : (
        <DialogContent sx={{ p: 3 }}>
          <Typography>Nie udało się załadować szczegółów zamówienia.</Typography>
        </DialogContent>
      )}
    </Dialog>
  );
};