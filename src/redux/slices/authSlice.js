import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAuthModal: true,
    user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    AuthModel: (state, actions) => {
      state.showAuthModal = actions.payload;
    },
     setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
     
  },
});

export const { AuthModel,setUser, clearUser, } = authSlice.actions;
export default authSlice.reducer;
