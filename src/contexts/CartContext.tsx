import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  image: string;
  pricePerDay: number;
  rentalDays: number;
  deliveryOption: 'standard' | 'express' | 'same-day';
  insuranceOption: 'basic' | 'premium';
  availability: 'available' | 'unavailable' | 'limited';
  minRentalDays: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateRentalDays: (itemId: string, newDays: number) => void;
  updateDeliveryOption: (itemId: string, option: 'standard' | 'express' | 'same-day') => void;
  updateInsuranceOption: (itemId: string, option: 'basic' | 'premium') => void;
  clearCart: () => void;
  cartCount: number;
  getDeliveryCost: (option: string) => number;
  getInsuranceCost: (option: string, days: number) => number;
  calculateItemTotal: (item: CartItem) => number;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Check if item already exists in cart
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          rentalDays: item.rentalDays,
          deliveryOption: item.deliveryOption,
          insuranceOption: item.insuranceOption,
        };
        return updatedCart;
      } else {
        // Add new item
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateRentalDays = (itemId: string, newDays: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, rentalDays: Math.max(item.minRentalDays, newDays) }
        : item
    ));
  };

  const updateDeliveryOption = (itemId: string, option: 'standard' | 'express' | 'same-day') => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, deliveryOption: option }
        : item
    ));
  };

  const updateInsuranceOption = (itemId: string, option: 'basic' | 'premium') => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, insuranceOption: option }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  const getDeliveryCost = (option: string) => {
    switch (option) {
      case "express": return 500;
      case "same-day": return 1000;
      default: return 0;
    }
  };

  const getInsuranceCost = (option: string, days: number) => {
    switch (option) {
      case "premium": return 200 * days;
      default: return 0;
    }
  };

  const calculateItemTotal = (item: CartItem) => {
    const baseCost = item.pricePerDay * item.rentalDays;
    const deliveryCost = getDeliveryCost(item.deliveryOption);
    const insuranceCost = getInsuranceCost(item.insuranceOption, item.rentalDays);
    return baseCost + deliveryCost + insuranceCost;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateRentalDays,
    updateDeliveryOption,
    updateInsuranceOption,
    clearCart,
    cartCount,
    getDeliveryCost,
    getInsuranceCost,
    calculateItemTotal,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
