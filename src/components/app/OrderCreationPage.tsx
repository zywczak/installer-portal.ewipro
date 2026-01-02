import React, { useState, useEffect } from 'react';
import {
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Box,
  Divider,
  List,
  CircularProgress,
  useTheme,
  Container,
  Card,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ProductDetailsDialog, { Product } from '../common/ProductDetailsDialog';
import { BasketDialog } from '../common/BasketDialog';
import { useBasket } from '../../hooks/useBasket';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

interface Category {
  id: number;
  name: string;
}

interface OrderCreationPageProps {
  projectId: string;
  contactId: string;
}

interface ProductListItemProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onClick }) => (
  <Box
      // Kontener główny
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        mb: 1.5, 
        bgcolor: '#f5f5f5', 
        borderRadius: 2, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
        cursor: 'pointer' 
      }}
      onClick={() => onClick(product)}
    >
    {/* Obraz / Ikona z procentem przeceny */}
      <Box
        sx={{
          width: 48, 
          height: 48,
          mr: 2,
          backgroundColor: '#f0f0f0',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          < PhotoCameraIcon sx={{ fontSize: 30, color: 'gray' }} /> 
        )}
        
        {/* Procent przeceny - tylko jeśli jest originalPrice i różni się od price */}
        {product.originalPrice && product.originalPrice !== product.price && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              left: -4,
              bgcolor: '#ff1744',
              color: '#fff',
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: '0.7rem',
              lineHeight: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            -{Math.round(((Number.parseFloat(product.originalPrice) - Number.parseFloat(product.price)) / Number.parseFloat(product.originalPrice)) * 100)}%
          </Box>
        )}
      </Box>

      {/* Informacje o produkcie (nazwa, volume, kod) */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body1" fontWeight={600} noWrap>
          {product.name}
        </Typography>
        {product.volume && (
          <Typography variant="caption" color="text.secondary" display="block">
            {product.volume}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {product.code}
        </Typography>
      </Box>
        {/* Cena i Status */}
      <Box sx={{ ml: 2, textAlign: 'right', flexShrink: 0 }}>
        {/* Cena */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography variant="body1" fontWeight={700} color="#000">
            £{product.price}
          </Typography>
          {product.originalPrice && product.originalPrice !== product.price && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              £{product.originalPrice}
            </Typography>
          )}
        </Box>

        {/* Status "Out of stock" - tylko jeśli produkt i wszystkie children są niedostępne */}
        {product.stockQty === 0 && (!product.children || product.children.every(c => c.stockQty === 0)) ? (
          <Button
            variant="contained"
            size="small"
            disabled
            sx={{
              bgcolor: '#e0e0e0', 
              color: 'black', 
              fontWeight: 600,
              mt: 0.5,
              textTransform: 'none',
              borderRadius: 1,
              height: 24, 
              '&.Mui-disabled': { 
                  color: 'black',
                  opacity: 0.8
              }
            }}
          >
            Out of stock
          </Button>
        ) : (
          // Dodatkowe pole, aby zachować stałe wyrównanie, gdy produkt jest dostępny
          <Box sx={{ height: 24, mt: 0.5 }} /> 
        )}
      </Box>
    </Box>
  );

const OrderCreationPage: React.FC<OrderCreationPageProps> = ({ projectId, contactId }) => {
  const theme = useTheme();
  const basket = useBasket();

  const projectID = Number(projectId);
  const contactID = Number(contactId);

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('https://api-veen-e.ewipro.com/installer/info/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'getProductCategories' })
      });
      const data = await response.json();
      setCategories(data.results || []);
      setActiveCategory(data.results?.[0]?.id || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCategories(false);
    }
  };

 const fetchProducts = async () => {
  setLoadingProducts(true);
  try {
    const token = localStorage.getItem('access');

    const filters: any = {};
    if (searchTerm) {
      filters.searchBase = searchTerm;
    } else if (activeCategory) {
      filters.categoryID = activeCategory;
    }

    const response = await fetch('https://api-veen-e.ewipro.com/installer/info/', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        action: 'getProductsData',
        projectID,
        contactID,
        filters: [filters],
        start: 0,
        limit: 20,
      }),
    });

    const data = await response.json();

    // mapowanie produktów wraz z wariantami
    const mapped: Product[] =
      data.results?.map((p: any) => ({
        id: p.id,
        name: p.variationName,
        code: p.variationCode || p.sku,
        volume: p.unit_size || '',
        price: p.rate,
        originalPrice: p.rateRRP,
        stockQty: p.stockQty ?? 0,
        isOutOfStock: p.stockQty === 0,
        imageUrl: p.photoURI || p.thumbnailURI,
        description: p.description,
        descriptionLong: p.descriptionLong,
        children: p.children?.map((c: any) => ({
          id: c.id,
          name: c.variationName,
          code: c.sku,
          volume: c.unit_size || '',
          price: c.rate,
          originalPrice: c.rateRRP,
          stockQty: c.stockQty ?? 0,
          isOutOfStock: c.stockQty === 0,
          imageUrl: c.photoURI || c.thumbnailURI,
          description: c.description,
          descriptionLong: c.descriptionLong,
        })),
      })) || [];

    setProducts(mapped);

  } catch (error) {
    console.error(error);
  } finally {
    setLoadingProducts(false);
  }
};




  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [searchTerm, activeCategory]);

  const handleBasketOpen = () => setBasketOpen(true);

  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
  <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 3, m: 2, mt: 0.1, boxSizing: 'border-box' }}>
    
    {/* AppBar + Search + Categories */}
    <Box
      position="sticky"
      sx={{
        backgroundColor: '#fff',
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Product"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          slotProps={{
            input : {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: theme.palette.grey[100],
              borderRadius: 2,
              '& fieldset': { border: 'none' }
            }
          },
          }}
        />

        <IconButton
          onClick={handleBasketOpen}
          sx={{ ml: 1, position: 'relative', color: theme.palette.success.main }}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 32 }} />
          {basket.getTotalItems() > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -6,
                right: 0,
                border: '1px solid #8a8a8aff',
                color: '#000000ff',
                borderRadius: '50%',
                width: 28,
                height: 28,
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 0px'
              }}
            >
              {basket.getTotalItems()}
            </Box>
          )}
        </IconButton>
      </Toolbar>

      {/* Categories */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1.5,
          py: 1.5,
          px: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {loadingCategories ? (
          <CircularProgress size={20} />
        ) : (
          categories.map(c => (
            <Button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              variant={c.id === activeCategory ? 'contained' : 'outlined'}
              size="small"
              sx={{
                flexShrink: 0,
                minWidth: 80,
                borderRadius: 20,
                fontWeight: 500,
                ...(c.id === activeCategory
                  ? { backgroundColor: '#4CAF50', color: '#fff', '&:hover': { backgroundColor: '#388E3C' } }
                  : { color: 'text.primary', borderColor: theme.palette.grey[400] }
                )
              }}
            >
              {c.name}
            </Button>
          ))
        )}
      </Box>
      
    </Box>
    <Divider sx={{ mx: 3 }} />
    {/* Lista produktów */}
    <Box sx={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' } }}>
      <Container maxWidth="md" sx={{ py: 1 }}>

        {loadingProducts ? (
          <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <CircularProgress />
          </Box>
        ) : (
          <List disablePadding>
            {products.map(p => (
              <ProductListItem key={p.id} product={p} onClick={setSelectedProduct} />
            ))}
          </List>
        )}
      </Container>
    </Box>

  </Card>
</Box>


      {/* PRODUCT DETAILS */}
      <ProductDetailsDialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToBasket={(product, quantity) => {
          basket.addItem(
            {
              id: product.id,
              name: product.name,
              code: product.code,
              price: product.price,
              originalPrice: product.originalPrice,
              imageUrl: product.imageUrl,
              stockQty: product.stockQty,
            },
            quantity
          );
        }}
      />

      {/* BASKET */}
      <BasketDialog
        open={basketOpen}
        items={basket.items}
        onClose={() => setBasketOpen(false)}
        onUpdateQuantity={basket.updateQuantity}
        onRemoveItem={basket.removeItem}
        totalNet={basket.getTotalNet()}
      />
    </>
  );
};

export default OrderCreationPage;