import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Button,
  Typography,
  useTheme,
  IconButton,
  InputBase,
  Divider,
  MenuItem,
  Select,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import api from '../../api/axiosApi';

export interface Product {
  stockQty: number;
  id: number;
  name: string;
  code: string;
  volume: string;
  price: string;
  originalPrice?: string;
  isOutOfStock?: boolean;
  imageUrl?: string;
  description?: string;
  descriptionLong?: string;
  children?: Product[];
  colors?: Array<{ colour_code: string; imageUrl?: string; thumbURI?: string }>;
}

interface ProductDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToBasket?: (product: Product, quantity: number, color?: string) => void;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  open,
  onClose,
  product,
  onAddToBasket,
}) => {
  const theme = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [selectedChild, setSelectedChild] = useState<Product | null>(null);
  const [colors, setColors] = useState<Array<{ colour_code: string; imageUrl?: string; thumbURI?: string }>>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [displayedImage, setDisplayedImage] = useState<string | undefined>(product?.imageUrl);

  const handleClose = () => {
    setSelectedChild(null);
    setQuantity(1);
    setColors([]);
    setSelectedColor('');
    setDisplayedImage(undefined);
    onClose();
  };

  useEffect(() => {
    setSelectedChild(null);
    setQuantity(1);
    setColors([]);
    setSelectedColor('');
    setDisplayedImage(product?.imageUrl);
  }, [product]);

  useEffect(() => {
    if (!selectedChild) {
      setColors([]);
      setSelectedColor('');
      setDisplayedImage(product?.imageUrl);
      return;
    }

    const fetchColors = async () => {
  try {
    const body = {
      action: "getColourCodes",
      filters: [
        { productID: selectedChild.id },
        { popularColoursOnly: true },
      ],
      start: 0,
      limit: 50000,
    };

    const res = await api.post(body);

    const fetchedColors = res.data?.results || [];

    setColors(fetchedColors);
    setSelectedColor(fetchedColors[0]?.colour_code || "");
    setDisplayedImage(
      fetchedColors[0]?.imageUrl ||
        selectedChild.imageUrl ||
        product?.imageUrl
    );
  } catch (err) {
    console.error(err);
    setColors([]);
    setSelectedColor("");
    setDisplayedImage(
      selectedChild.imageUrl || product?.imageUrl
    );
  }
};

    fetchColors();
  }, [selectedChild, product]);

  useEffect(() => {
  if (!selectedColor) return;

  const colorObj = colors.find(c => c.colour_code === selectedColor);
  setDisplayedImage(
    colorObj?.thumbURI || colorObj?.imageUrl || selectedChild?.imageUrl || product?.imageUrl
  );
}, [selectedColor, colors, selectedChild, product]);

  if (!product) return null;

  const hasVariants = product.children && product.children.length > 0;
  const fullScreen = window.innerWidth < 600;

  const displayedProduct = selectedChild || product;

const unitPrice = Number.parseFloat(displayedProduct.price || "0");
const unitOriginal = Number.parseFloat(displayedProduct.originalPrice || "0");

const totalPrice = (unitPrice * quantity).toFixed(2);
const totalOriginal = (unitOriginal * quantity).toFixed(2);


  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      return Math.max(1, Math.min(newQty, displayedProduct.stockQty));
    });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          [theme.breakpoints.down('sm')]: {
            height: '100%',
            maxHeight: 'none',
            margin: 0,
          },
        },
      }}
    >
      <Box sx={{ backgroundColor: '#fff', color: 'text.primary', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {displayedProduct.name}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
              {displayedProduct.code}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mx: 3 }} />

      <Box
        sx={{
          px: 3,
          py: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          {displayedImage ? (
            <img
              src={displayedImage}
              alt={displayedProduct.name}
              style={{ maxWidth: '50%', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.src = selectedChild?.imageUrl || '';
                if (!selectedChild?.imageUrl) {
                  e.currentTarget.style.display = 'none';
                }
              }}
            />
          ) : (
            <PhotoCameraIcon sx={{ fontSize: 80, color: 'gray' }} />
          )}
        </Box>
        {hasVariants && (
          <Box sx={{ px: 1, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Select variant:
            </Typography>

            <Select
              fullWidth
              value={selectedChild?.id || ''}
              onChange={e => {
                const child = product.children!.find(c => c.id === Number(e.target.value));
                setSelectedChild(child || null);
              }}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="" disabled>
                Choose a variant...
              </MenuItem>
              {product.children!.map(child => (
                <MenuItem key={child.id} value={child.id}>
                  {child.description}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
        {colors.length > 0 && (
          <Box sx={{ px: 1, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Select color:
            </Typography>

            <Select
              fullWidth
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              displayEmpty
              sx={{ borderRadius: 2 }}
              renderValue={(value) => {
                const colorObj = colors.find(c => c.colour_code === value);
                if (!colorObj) return 'Choose a color...';
                
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <span>{colorObj.colour_code}</span>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: '#ffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginLeft: 'auto'
                      }}
                    >
                      {colorObj.thumbURI && (
                        <img
                          src={colorObj.thumbURI}
                          alt={colorObj.colour_code}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </Box>
                  </Box>
                );
              }}
            >
              <MenuItem value="" disabled>
                Choose a color...
              </MenuItem>
              {colors.map((color, idx) => (
                <MenuItem key={`${color.colour_code}-${idx}`} value={color.colour_code}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <span>{color.colour_code}</span>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginLeft: 'auto'
                      }}
                    >
                      {color.thumbURI && (
                        <img
                          src={color.thumbURI}
                          alt={color.colour_code}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {displayedProduct.descriptionLong && (
          <Box sx={{ mb: 2 }}>
            <div dangerouslySetInnerHTML={{ __html: displayedProduct.descriptionLong }} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid ' + theme.palette.grey[200],
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: theme.palette.grey[600] }}>
            Price excl. VAT
          </Typography>


            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
  £{totalPrice}
</Typography>

{displayedProduct.originalPrice &&
  displayedProduct.originalPrice !== displayedProduct.price && (
    <Typography sx={{ textDecoration: 'line-through', color: theme.palette.grey[500] }}>
      £{totalOriginal}
    </Typography>
  )}

        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {displayedProduct.stockQty > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid ' + theme.palette.grey[300],
                borderRadius: 2,
                p: 0.5,
                flexGrow: 1,
                maxWidth: 180,
              }}
            >
              <IconButton size="small" onClick={() => handleQuantityChange(-1)}>
                <RemoveIcon />
              </IconButton>

              <InputBase
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setQuantity(1);
                    return;
                  }
                  
                  const numValue = Number.parseInt(value, 10);
                  if (!Number.isNaN(numValue) && numValue > 0) {
                    setQuantity(Math.min(numValue, displayedProduct.stockQty));
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || Number.parseInt(e.target.value, 10) < 1) {
                    setQuantity(1);
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
                }}
              />

              <IconButton size="small" onClick={() => handleQuantityChange(1)} sx={{ color: '#4CAF50' }}>
                <AddIcon />
              </IconButton>
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            sx={{
              flexGrow: 2,
              backgroundColor: displayedProduct.stockQty === 0 ? '#B0B0B0' : '#4CAF50',
              '&:hover': { backgroundColor: displayedProduct.stockQty === 0 ? '#B0B0B0' : '#388E3C' },
              borderRadius: 2,
              fontWeight: 700,
            }}
            disabled={displayedProduct.stockQty === 0}
            onClick={() => {
              if (onAddToBasket && displayedProduct.stockQty > 0) {
                onAddToBasket(displayedProduct, quantity, selectedColor);
              }
              handleClose();
            }}
          >
            {displayedProduct.stockQty === 0 ? 'OUT OF STOCK' : 'ADD'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProductDetailsDialog;
