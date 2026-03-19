// app/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getCartItems, addItemToCart as addItemToCartDB, updateItemQuantityInCart as updateItemQuantityInCartDB, removeItemFromCart as removeItemFromCartDB, CartItem as DB_CartItem } from '@/lib/indexeddb';

// Define the shape of a CartItem within the context
interface CartItem extends DB_CartItem {
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'price'>) => Promise<void>;
  updateItemQuantity: (itemId: string | number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string | number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ITEM_PRICE = 25000; // Rp 25.000 per item

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateCartTotals = useCallback((items: CartItem[]) => {
    const quantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const price = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    setTotalQuantity(quantity);
    setTotalPrice(price);
  }, []);

  // Load cart items from IndexedDB on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const itemsFromDB = await getCartItems();
        const itemsWithPrice: CartItem[] = itemsFromDB.map(item => ({ 
          ...item, 
          quantity: item.quantity || 1, // Ensure quantity is at least 1
          price: ITEM_PRICE 
        }));
        setCartItems(itemsWithPrice);
        calculateCartTotals(itemsWithPrice);
      } catch (error) {
        console.error('Failed to load cart from IndexedDB:', error);
      }
    };
    loadCart();
  }, [calculateCartTotals]);

  const addToCart = useCallback(async (item: Omit<CartItem, 'price'>) => {
    try {
      const itemWithPrice: CartItem = {
        ...item,
        quantity: item.quantity || 1,
        price: ITEM_PRICE
      };
      await addItemToCartDB(itemWithPrice); // Add/Update in IndexedDB

      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(i => i.itemId === item.itemId);
        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          newItems = [...prevItems];
          const currentQty = newItems[existingItemIndex].quantity || 0;
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: currentQty + (item.quantity || 1)
          };
        } else {
          newItems = [...prevItems, itemWithPrice];
        }

        calculateCartTotals(newItems);
        return newItems;
      });

      console.log(`Item ${item.itemId} added to cart context.`);
    } catch (error) {
      console.error('Failed to add item to cart context:', error);
      throw error;
    }
  }, [calculateCartTotals]);

  const updateItemQuantity = useCallback(async (itemId: string | number, quantity: number) => {
    try {
      await updateItemQuantityInCartDB(itemId, quantity);
      setCartItems(prevItems => {
        const itemIndex = prevItems.findIndex(item => item.itemId === itemId);
        if (itemIndex === -1) return prevItems; // Item not found

        let newItems = [...prevItems];
        if (quantity <= 0) {
          newItems.splice(itemIndex, 1); // Remove item if quantity is 0 or less
        } else {
          newItems[itemIndex] = { ...newItems[itemIndex], quantity };
        }
        calculateCartTotals(newItems);
        return newItems;
      });
    } catch (error) {
      console.error('Failed to update item quantity in cart context:', error);
    }
  }, [calculateCartTotals]);

  const removeFromCart = useCallback(async (itemId: string | number) => {
    try {
      await removeItemFromCartDB(itemId);
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => item.itemId !== itemId);
        calculateCartTotals(newItems);
        return newItems;
      });
    } catch (error) {
      console.error('Failed to remove item from cart context:', error);
    }
  }, [calculateCartTotals]);

  const value = {
    cartItems,
    totalQuantity,
    totalPrice,
    addToCart,
    updateItemQuantity,
    removeFromCart,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
