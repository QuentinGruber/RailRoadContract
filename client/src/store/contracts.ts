import { createSlice } from "@reduxjs/toolkit";

export const contracts = createSlice({
  name: "contracts",
  initialState: {
    cardContract: null,
    ticketContract: null,
  },
  reducers: {
    updateCardContract: (state, action) => {
      state.cardContract = action.payload;
    },
    updateTicketContract: (state, action) => {
      state.ticketContract = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateCardContract, updateTicketContract } = contracts.actions;

export default contracts.reducer;
