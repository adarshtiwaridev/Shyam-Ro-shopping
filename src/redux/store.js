import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import customConfigReducer from "./slices/customConfigSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    category: categoryReducer,
    product: productReducer,
    customConfig: customConfigReducer,
  },
});
