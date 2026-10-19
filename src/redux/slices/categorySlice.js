import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const idx = state.categories.findIndex(cat => cat.id === action.payload.id || cat._id === action.payload._id);
      if (idx !== -1) {
        state.categories[idx] = action.payload;
      }
    },
  },
});

export const { setCategories, addCategory, updateCategory } = categorySlice.actions;
export default categorySlice.reducer; 