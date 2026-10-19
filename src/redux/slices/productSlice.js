import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const idx = state.products.findIndex(prod => prod.id === action.payload.id || prod._id === action.payload._id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(prod => prod.id !== action.payload && prod._id !== action.payload);
    },
  },
});

export const { setProducts, addProduct, updateProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer; 