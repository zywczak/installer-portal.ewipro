import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  InputBase,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { BasketItem } from "../../hooks/useBasket";
import EmptyStateBox from "./EmptyStateBox";

interface BasketDialogProps {
  open: boolean;
  items: BasketItem[];
  onClose: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  totalNet: number;
}

export const BasketDialog: React.FC<BasketDialogProps> = ({ 
  open, 
  items, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem,
  totalNet 
}) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: '90vh', display: 'flex', flexDirection: 'column' } } }}
    >

      <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, bgcolor: 'white' }}>
        <Typography variant="h6" fontWeight={700}>Basket</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="medium" sx={{ color: "text.primary" }} />
        </IconButton>
      </Box>

      <Divider sx={{ mx: 3, mb: 1 }} />

      <DialogContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* PRODUCT LIST */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none'
          }}
        >
          {items.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyStateBox
                icon={<ShoppingCartIcon />}
                text="Your basket is empty"
                isDisabled={true}
                size={{ width: "100%", height: 150 }}
              />
            </Box>
          ) : (
            items.map(item => (
              <Box key={item.id} sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                borderRadius: 2,
                bgcolor: '#f5f5f5',
                border: "1px solid #e0e0e0"
              }}>
              {/* Discount Badge */}
              {item.percentDiscount && item.percentDiscount > 0 && (
                <Chip
                  label={`-${item.percentDiscount}%`}
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

              {/* Delete Button */}
              <IconButton
                onClick={() => onRemoveItem(item.id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'black',
                  padding: '6px',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              {/* Top Row: Image & Description */}
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
                  <Typography variant="caption" color="text.secondary">{item.productCode}</Typography>
                </Box>
              </Box>

              {/* Bottom Row: Price & Quantity */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body1" fontWeight={700}>£{item.rate.toFixed(2)}</Typography>
                  {item.percentDiscount && item.percentDiscount > 0 && (
                    <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
                      £{item.rateRRP?.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1.5,
                    bgcolor: 'white',
                    p: 0.5,
                    minWidth: 120,
                    ml: 2
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      const newQty = Math.max(1, item.quantity - 1);
                      onUpdateQuantity(item.id, newQty);
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <InputBase
                    value={item.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        onUpdateQuantity(item.id, 1);
                        return;
                      }
                      
                      const numValue = Number.parseInt(value, 10);
                      if (!Number.isNaN(numValue) && numValue > 0) {
                        const maxQty = item.stockQty || 100;
                        onUpdateQuantity(item.id, Math.min(numValue, maxQty));
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '' || Number.parseInt(e.target.value, 10) < 1) {
                        onUpdateQuantity(item.id, 1);
                      }
                    }}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      style: { textAlign: 'center', fontWeight: 600 }
                    }}
                    sx={{
                      flexGrow: 1,
                      textAlign: 'center',
                      '& input': { textAlign: 'center', fontWeight: 600, padding: '4px' }
                    }}
                  />

                  <IconButton 
                    size="small" 
                    onClick={() => {
                      const maxQty = item.stockQty || 100;
                      const newQty = Math.min(item.quantity + 1, maxQty);
                      onUpdateQuantity(item.id, newQty);
                    }}
                    sx={{ color: '#4CAF50' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            ))
          )}
        </Box>

        {/* TOTAL NET */}
        <Box sx={{ px: 4, pt: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>Total net</Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" fontWeight={700}>£{totalNet.toFixed(2)}</Typography>
             {items.some(item => item.percentDiscount && item.percentDiscount > 0) && (
              <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled", mb: 0.5 }}>
                £{items.reduce((sum, item) => sum + (item.rateRRP || item.rate) * item.quantity, 0).toFixed(2)}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">+ shipping costs</Typography>
          </Box>
        </Box>

        {/* CHECKOUT & SAVE BUTTONS */}
        <Box sx={{ display: 'flex', gap: 2, px: 4, pb : 2 }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#54A852",
              color: "#54A852",
              "&:hover": { borderColor: "#3c7a3b", bgcolor: "rgba(84, 168, 82, 0.04)" },
              fontWeight: 700,
              py: 1.2,
              borderRadius: 2,
              minWidth: 120
            }}
            onClick={() => console.log("Save clicked")}
          >
            SAVE
          </Button>

          <Button
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardIosIcon />}
            sx={{ bgcolor: "#54A852", "&:hover": { bgcolor: "#3c7a3b" }, fontWeight: 700, py: 1.2, borderRadius: 2 }}
            onClick={() => console.log("Checkout clicked")}
          >
            CHECK OUT
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
