import { createSlice } from "@reduxjs/toolkit";

export const connectedWalletSlice = createSlice({
  name: "connectedWallet",
  initialState: {
    value: null,
  },
  reducers: {
    updateConnectedWallet: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateConnectedWallet } = connectedWalletSlice.actions;

export default connectedWalletSlice.reducer;
