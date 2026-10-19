import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

// Safe helper to sync to localStorage
const saveCartToStorage = (items) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart(state, action) {
      if (Array.isArray(action.payload)) {
        state.cartItems = action.payload;
      }
    },
    addToCart(state, action) {
      const item = action.payload;
      const exist = state.cartItems.find((p) => p._id === item._id);
      if (exist) {
        exist.quantity = (exist.quantity || 1) + 1;
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }
      saveCartToStorage(state.cartItems);
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter((p) => p._id !== action.payload);
      saveCartToStorage(state.cartItems);
    },
    increaseQty(state, action) {
      const item = state.cartItems.find((p) => p._id === action.payload);
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
      }
      saveCartToStorage(state.cartItems);
    },
    decreaseQty(state, action) {
      const item = state.cartItems.find((p) => p._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCartToStorage(state.cartItems);
    },
    clearCart(state) {
      state.cartItems = [];
      saveCartToStorage([]);
    },
  },
});

export const {
  initializeCart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
