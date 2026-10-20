import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../data/menuData';

export interface CartItem {
  cartItemId: string;
  dish: MenuItem;
  quantity: number;
  selectedPrice: number;
  selectedVariantLabel?: string;
  notes?: string;
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup' | 'dine-in';
  deliveryAddress?: string;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'upi' | 'counter';
  status: 'confirmed' | 'preparing' | 'ready' | 'completed';
  estimatedTimeMins: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (dish: MenuItem, customPrice?: number, variantLabel?: string, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  updateItemNotes: (cartItemId: string, notes: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeOrder: PlacedOrder | null;
  placeOrder: (orderData: Omit<PlacedOrder, 'orderId' | 'createdAt' | 'status' | 'estimatedTimeMins'>) => PlacedOrder;
  clearActiveOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('knl_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrder, setActiveOrder] = useState<PlacedOrder | null>(() => {
    try {
      const saved = localStorage.getItem('knl_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('knl_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('knl_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('knl_active_order');
    }
  }, [activeOrder]);

  const addToCart = (dish: MenuItem, customPrice?: number, variantLabel?: string, notes?: string) => {
    // Determine effective price: customPrice -> dish.price -> highest variant (revised edition) -> 180 fallback
    let price = customPrice;
    if (price === undefined || price === null) {
      if (dish.price !== null) {
        price = dish.price;
      } else if (dish.priceVariants && dish.priceVariants.length > 0) {
        // default to the latest / highest revised edition
        const latest = dish.priceVariants[dish.priceVariants.length - 1];
        price = latest.price;
        if (!variantLabel) variantLabel = latest.label;
      } else {
        price = 180;
      }
    }

    const uniqueId = `${dish.id}-${price}-${notes || ''}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === uniqueId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === uniqueId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            cartItemId: uniqueId,
            dish,
            quantity: 1,
            selectedPrice: price,
            selectedVariantLabel: variantLabel,
            notes: notes || '',
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const updateItemNotes = (cartItemId: string, notes: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, notes } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.selectedPrice * item.quantity,
    0
  );

  const totalCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const placeOrder = (orderData: Omit<PlacedOrder, 'orderId' | 'createdAt' | 'status' | 'estimatedTimeMins'>): PlacedOrder => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KNL-${randomSuffix}`;
    const newOrder: PlacedOrder = {
      ...orderData,
      orderId,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      estimatedTimeMins: 20,
    };

    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    return newOrder;
  };

  const clearActiveOrder = () => {
    setActiveOrder(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemNotes,
        clearCart,
        subtotal,
        totalCount,
        isCartOpen,
        setIsCartOpen,
        activeOrder,
        placeOrder,
        clearActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
