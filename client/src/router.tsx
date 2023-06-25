// import contracts abi
const cardContract = require("./contracts/RailRoadCard.json");
const ticketContrat = require("./contracts/RailRoadTicket.json");
import {
  REACT_APP_CARD_CONTRACT_ADDRESS,
  REACT_APP_TICKET_CONTRACT_ADDRESS,
} from "./config";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";
import React, { useState } from "react";
import { useEffect } from "react";
import "./App.css";

import Accueil from "./pages/Accueil";
import CardCreator from "./pages/CardCreator";
import CardList from "./pages/CardList";
import UserCardList from "./pages/UserCardList";
import BuyTicket from "./pages/BuyTicket";
import UserTicketList from "./pages/UserTicketList";
import {
  enableWeb3Provider,
  getCardContract,
  getCurrentAccount,
  getProvider,
  getTicketContract,
} from "./web3utils";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { updateConnectedWallet } from "./store/connectedWallet";
import { updateCardContract, updateTicketContract } from "./store/contracts";
import { updateWeb3Provider } from "./store/web3provider";

function Router() {
  const [hasAWebProvider, setHasAWebProvider] = useState<boolean | null>(null);
  const walletConnected = useSelector(
    (state) => (state as any).connectedWalletSlice.value
  );
  const dispatch = useDispatch();
  useEffect(() => {
    enableWeb3Provider(setHasAWebProvider);
  }, []);
  useEffect(() => {
    if (hasAWebProvider) {
      getCurrentAccount((e: any) => {
        dispatch(updateConnectedWallet(e));
      });
    }
  }, [hasAWebProvider]);
  useEffect(() => {
    if (walletConnected) {
      const provider = getProvider();
      dispatch(updateWeb3Provider(provider));
      const cardContract = getCardContract(provider);
      dispatch(updateCardContract(cardContract));
      const ticketContract = getTicketContract(provider);
      dispatch(updateTicketContract(ticketContract));
    }
  }, [walletConnected]);
  return (
    <>
      {hasAWebProvider && walletConnected ? (
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/card-creator" element={<CardCreator />} />
          <Route path="/card-list" element={<CardList />} />
          <Route path="/my-cards" element={<UserCardList />} />
          <Route path="/buy-ticket" element={<BuyTicket />} />
          <Route path="/my-tickets" element={<UserTicketList />} />
        </Routes>
      ) : hasAWebProvider === null || walletConnected === null ? (
        <p>loading</p>
      ) : (
        <p>pas de metamask</p>
      )}
    </>
  );
}

export default Router;
