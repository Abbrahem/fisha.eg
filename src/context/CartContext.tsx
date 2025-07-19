'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isInCart: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAX_QUANTITY = 10;
const CART_STORAGE_KEY = 'kenzo_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart items
        if (Array.isArray(parsedCart)) {
          const validCart = parsedCart.filter(item => 
            item.id && 
            item.name && 
            typeof item.price === 'number' && 
            typeof item.quantity === 'number' &&
            item.quantity > 0 &&
            item.quantity <= MAX_QUANTITY &&
            item.size &&
            item.color
          );
          setCart(validCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // If there's an error, start with an empty cart
      setCart([]);
    }
  }, []);

  // Save cart to localStorage and update totals
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setTotal(newTotal);
      setItemCount(newItemCount);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === item.id && 
        cartItem.size === item.size && 
        cartItem.color === item.color
      );
      if (existingItem) {
        // If item exists with same size and color, increase quantity but respect MAX_QUANTITY
        return prevCart.map(cartItem =>
          (cartItem.id === item.id && 
           cartItem.size === item.size && 
           cartItem.color === item.color)
            ? { 
                ...cartItem, 
                quantity: Math.min(cartItem.quantity + 1, MAX_QUANTITY)
              }
            : cartItem
        );
      }
      // If item doesn't exist or has different size/color, add it with quantity 1
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1 || quantity > MAX_QUANTITY) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  const isInCart = (itemId: string) => {
    return cart.some(item => item.id === itemId);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        total,
        itemCount,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 