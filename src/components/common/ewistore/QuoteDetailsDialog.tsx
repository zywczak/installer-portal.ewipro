import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import { QuoteItem, ProformaItem, QuoteDetailsResponse, OrderDetailsItem } from "./types";
import { fetchQuoteDetails } from "./api";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Chip, TextField, Select, MenuItem } from "@mui/material";

interface QuoteProductItemProps {
  item: any;
}

const QuoteProductItem: React.FC<QuoteProductItemProps> = ({ item }) => {
  const netPrice = Number(item.rate || 0);
  const originalPrice = Number(item.rateRRP || 0);
  const discountPercentage = Number(item.percentDiscount || 0);
  const quantity = item.quantity || item.quantityOriginal || 1;
  const photo = item.photoURI || item.productPhotoURI || null;

  return (
    <Box sx={{
      p: 2, mb: 1.5, bgcolor: 'white', borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      {discountPercentage > 0 && (
        <Chip label={`-${discountPercentage}%`} size="small"
          sx={{
            position: 'absolute', top: 0, left: 0,
            bgcolor: '#dc3545', color: 'white', fontWeight: 'bold',
            borderTopLeftRadius: 8, borderBottomRightRadius: 8, borderRadius: 0,
            height: 24, '& .MuiChip-label': { px: 1 }
          }}
        />
      )}

      <Box display="flex" alignItems="center" flexGrow={1} pt={discountPercentage ? 2 : 0}>
        <Box sx={{
          width: 48, height: 48, mr: 2, borderRadius: 1, bgcolor: "#fff",
          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {photo ? (
            <img src={photo} alt={item.description} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : <Inventory2Icon color="disabled" />}
        </Box>

        <Box>
          <Typography variant="body1" fontWeight={600}>{item.description}</Typography>
          <Typography variant="caption" color="text.secondary">{item.productCode}</Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'right', ml: 2, minWidth: '80px', pt: discountPercentage ? 2 : 0 }}>
        <Typography variant="h6" fontWeight={700}>£{netPrice.toFixed(2)}</Typography>
        {discountPercentage > 0 && (
          <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
            £{originalPrice.toFixed(2)}
          </Typography>
        )}
      </Box>

      <Typography variant="body1" sx={{ ml: 2, minWidth: '30px', textAlign: 'center' }}>{quantity}</Typography>
    </Box>
  );
};


interface QuoteDetailsDialogProps {
  quote: QuoteItem | ProformaItem | null;
  projectID: number;
  contactID: number;
  onClose: () => void;
}

export const QuoteDetailsDialog: React.FC<QuoteDetailsDialogProps> = ({
  quote,
  projectID,
  contactID,
  onClose
}) => {
  const [details, setDetails] = useState<QuoteDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<OrderDetailsItem[]>([]);
  const [originalItems, setOriginalItems] = useState<OrderDetailsItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (details?.quoteDetails?.items) {
      setItems(details.quoteDetails.items);
      setOriginalItems(details.quoteDetails.items);
      setHasChanges(false);
    }
  }, [details]);

  const checkForChanges = (newItems: OrderDetailsItem[]) => {
    if (newItems.length !== originalItems.length) {
      setHasChanges(true);
      return;
    }
    
    const hasChanged = newItems.some((item) => {
      const originalItem = originalItems.find(orig => orig.id === item.id);
      return !originalItem || originalItem.quantity !== item.quantity;
    });
    
    setHasChanges(hasChanged);
  };

  const handleQuantityChange = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newItems = items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
    setItems(newItems);
    checkForChanges(newItems);
  };

  const handleRemoveItem = (id: string | number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    checkForChanges(newItems);
  };

  const handleSave = () => {
    console.log("Save changes", items);
    setOriginalItems(items);
    setHasChanges(false);
    // Tutaj dodać logikę zapisywania zmian
  };

  const calculateTotalNet = () => {
    return items.reduce((sum, item) => {
      const price = Number(item.rate || 0);
      const quantity = Number(item.quantity || 0);
      return sum + (price * quantity);
    }, 0);
  };


  useEffect(() => {
    if (!quote) {
      setDetails(null);
      return;
    }

    setLoading(true);
    fetchQuoteDetails(quote.id)
      .then(setDetails)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [quote]);

  if (!quote) return null;

  const isProforma = quote.quoteType === "Proforma";
  // Używamy quoteExpired z details.quoteDetails zamiast z quote
  const expired = details?.quoteDetails?.quoteExpired ?? quote.quoteExpired;

  return (
    <Dialog
      open={!!quote}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh', display: 'flex', flexDirection: 'column' } }}
    >
      {/* HEADER */}
      <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, bgcolor: 'white' }}>
        <Typography variant="h6" fontWeight={700}>
          Oferta #{quote.id}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="medium" sx={{ color: "text.primary" }} />
        </IconButton>
      </Box>

      <Divider sx={{ mx: 3, mb: 1 }} />

      <DialogContent sx={{
        p: 2,
        px: 3,
        flexGrow: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <Typography>Ładowanie...</Typography>
          </Box>
        ) : details && details.quoteDetails ? (
          <>
            {/* STATUS */}
            <Box
              bgcolor="#f5f5f5"
              p={2}
              borderRadius={2}
              mb={2}
              border="1px solid #e0e0e0"
            >
              {expired ? (
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body2" >
                    Quote has expired and is no longer editable
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      "&:hover": { opacity: 0.85 },
                      fontWeight: 700,
                      color: "#2e7d32",
                      bgcolor: "#e8f5e9"
                    }}
                    onClick={() => console.log("Reuse to create new order clicked")}
                  >
                    <ContentCopyIcon />
                    <Typography>Reuse to create new order</Typography>
                  </Box>
                </Box>
              ) :  (
                <Box display="flex" alignItems="center">
                  <DescriptionIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" fontWeight={700} color="text.secondary">
                    Quote expires: {details.quoteDetails.dateExpire}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* PRODUCT LIST */}
            <Box display="flex" flexDirection="column" gap={1.5} mb={2}>
              {items.map(item => (
                <Box key={item.id || item.productCode} sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                  border: "1px solid #e0e0e0"
                }}>
                  {/* Discount Badge */}
                  {Number(item.percentDiscount) > 0 && (
                    <Chip
                      label={`-${Number(item.percentDiscount)}%`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        bgcolor: '#dc3545',
                        color: 'white',
                        fontWeight: 'bold',
                        borderTopLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        borderRadius: 0,
                        height: 24,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}

                  {/* Delete Button - Top Right */}
                  {!expired && (
                    <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'black',
                        padding: '6px',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}

                  {/* Top Row: Image and Description */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 1, pr: 4 }}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      bgcolor: "#f5f5f5",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {item.photoURI ? (
                        <img src={item.photoURI} alt={item.description} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <Inventory2Icon color="disabled" />
                      )}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.productCode}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bottom Row: Price and Quantity */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" fontWeight={700}>
                        £{Number(item.rate).toFixed(2)}
                      </Typography>
                      {Number(item.percentDiscount) > 0 && (
                        <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
                          £{Number(item.rateRRP).toFixed(2)}
                        </Typography>
                      )}
                    </Box>

                    {/* Quantity Selector */}
                    {!expired ? (
                      <Select
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        size="small"
                        sx={{
                          minWidth: 80,
                          height: 40,
                          bgcolor: 'white',
                          '& .MuiSelect-select': {
                            textAlign: 'center',
                            py: 1
                          }
                        }}
                      >
                        {[...Array(20)].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'center' }}>
                        Qty: {item.quantity}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* TOTAL NET */}
            <Box sx={{
              p: 2,
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <Typography variant="h6" fontWeight={700}>Total net</Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" fontWeight={700}>£{calculateTotalNet().toFixed(2)}</Typography>
                <Typography variant="caption" color="text.secondary">+ shipping costs</Typography>
              </Box>
            </Box>

            {/* CHECKOUT BUTTON */}
            {!expired && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIosIcon />}
                  sx={{
                    bgcolor: "#54A852",
                    "&:hover": { bgcolor: "#3c7a3b" },
                    fontWeight: 700,
                    py: 1.2,
                    borderRadius: 2
                  }}
                  onClick={() => console.log("Checkout clicked")}
                >
                  CHECK OUT
                </Button>
                {hasChanges && (
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#54A852",
                      color: "#54A852",
                      "&:hover": {
                        borderColor: "#3c7a3b",
                        bgcolor: "rgba(84, 168, 82, 0.04)"
                      },
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 2,
                      minWidth: 120
                    }}
                    onClick={handleSave}
                  >
                    SAVE
                  </Button>
                )}
              </Box>
            )}
          </>
        ) : (
          <Typography>Nie udało się załadować szczegółów oferty.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};
