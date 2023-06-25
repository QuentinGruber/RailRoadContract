import { configureStore } from "@reduxjs/toolkit";
import { connectedWalletSlice } from "./store/connectedWallet";
import contracts from "./store/contracts";

export default configureStore({
  reducer: { connectedWalletSlice: connectedWalletSlice.reducer, contracts },
});
