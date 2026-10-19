import { createSlice } from "@reduxjs/toolkit";

const LOCAL_KEY = "custom-ro-config";

const getInitialConfig = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const initialState = {
  config: getInitialConfig(),
};

const customConfigSlice = createSlice({
  name: "customConfig",
  initialState,
  reducers: {
    setCustomConfig(state, action) {
      state.config = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(action.payload));
      }
    },
    clearCustomConfig(state) {
      state.config = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_KEY);
      }
    },
    loadCustomConfig(state) {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
          try {
            state.config = JSON.parse(stored);
          } catch {
            state.config = null;
          }
        } else {
          state.config = null;
        }
      }
    },
  },
});

export const { setCustomConfig, clearCustomConfig, loadCustomConfig } = customConfigSlice.actions;
export default customConfigSlice.reducer; 