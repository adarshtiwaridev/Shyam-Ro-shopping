 import { createSlice } from "@reduxjs/toolkit";

// Load orders from localStorage if available
const loadOrdersFromLocalStorage = () => {
  if (typeof window === 'undefined') return [];
  const savedOrders = localStorage.getItem("user-orders");
  return savedOrders ? JSON.parse(savedOrders) : [];
};

const initialState = {
  orders: loadOrdersFromLocalStorage(),
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    placeOrder(state, action) {
      const existingOrderIndex = state.orders.findIndex(
        order => order.orderId === action.payload.orderId
      );

      if (existingOrderIndex >= 0) {
        // Update existing order
        state.orders[existingOrderIndex] = {
          ...state.orders[existingOrderIndex],
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Add new order
        const newOrder = {
          ...action.payload,
          status: action.payload.status || "pending",
          createdAt: action.payload.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.orders.unshift(newOrder); // Add to beginning of array
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("user-orders", JSON.stringify(state.orders));
      }
    },
    
    updateOrderStatus(state, action) {
      const { orderId, status, ...updates } = action.payload;
      const orderIndex = state.orders.findIndex(o => o.orderId === orderId || o.id === orderId);
      
      if (orderIndex >= 0) {
        state.orders[orderIndex] = {
          ...state.orders[orderIndex],
          status,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("user-orders", JSON.stringify(state.orders));
        }
      }
    },
    
    setOrders(state, action) {
      state.orders = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("user-orders", JSON.stringify(state.orders));
      }
    },
  },
});

export const { placeOrder, updateOrderStatus, setOrders } = orderSlice.actions;
export default orderSlice.reducer;
