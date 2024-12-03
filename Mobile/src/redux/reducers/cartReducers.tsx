import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  product_name: string;
  image: string;
  selling_price: number;
  quantity: number;
  discount?: number;
  is_Sale?: boolean;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  discount: number; // Add discount to state
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  discount: 0 // Initialize discount as 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity: (state, action: PayloadAction<{id: number, quantity: number}>) => {
      const item = state.items.find(item => item.id == action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.discount = 0; // Reset discount when clearing cart
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    applyItemDiscount: (state, action: PayloadAction<{id: number, discount: number}>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.discount = action.payload.discount;
      }
    }
  }
});

export const {
  setCartItems,
  setLoading,
  setError,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setDiscount,
  applyItemDiscount
} = cartSlice.actions;

export default cartSlice.reducer;
