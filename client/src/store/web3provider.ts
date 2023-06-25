import { createSlice } from "@reduxjs/toolkit";

export const web3Provider = createSlice({
  name: "web3Provider",
  initialState: {
    value: null,
  },
  reducers: {
    updateWeb3Provider: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateWeb3Provider } = web3Provider.actions;

export default web3Provider.reducer;
