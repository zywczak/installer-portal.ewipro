import { useState, useEffect } from 'react';

export interface BasketItem {
  id: number;
  description: string;
  productCode: string;
  rate: number;
  rateRRP?: number;
  percentDiscount?: number;
  quantity: number;
  photoURI?: string;
  stockQty?: number;
}

const BASKET_KEY = 'ewipro_basket';

export const useBasket = () => {
  const [items, setItems] = useState<BasketItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(BASKET_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse basket:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BASKET_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: {
    id: number;
    name: string;
    code: string;
    price: string;
    originalPrice?: string;
    imageUrl?: string;
    stockQty?: number;
  }, quantity: number = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const rate = Number.parseFloat(product.price);
        const rateRRP = product.originalPrice ? Number.parseFloat(product.originalPrice) : undefined;
        const percentDiscount = rateRRP && rateRRP > rate 
          ? Math.round(((rateRRP - rate) / rateRRP) * 100) 
          : undefined;

        return [...prev, {
          id: product.id,
          description: product.name,
          productCode: product.code,
          rate,
          rateRRP,
          percentDiscount,
          quantity,
          photoURI: product.imageUrl,
          stockQty: product.stockQty,
        }];
      }
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearBasket = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalNet = () => {
    return items.reduce((sum, item) => sum + item.rate * item.quantity, 0);
  };

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearBasket,
    getTotalItems,
    getTotalNet,
  };
};
