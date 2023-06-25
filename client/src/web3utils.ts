import { ethers } from "ethers";
import React from "react";
import {
  REACT_APP_CARD_CONTRACT_ADDRESS,
  REACT_APP_TICKET_CONTRACT_ADDRESS,
} from "./config";

const { abi: cardContractAbi } = require("./contracts/RailRoadCard.json");
const {
  abi: ticketContractAbi,
} = require("./contracts/RailRoadTicket.json");

export async function enableWeb3Provider(
  setter: React.Dispatch<React.SetStateAction<boolean | null>>
) {
  const ethereum = (window as any).ethereum;
  if (ethereum) {
    await ethereum.enable();
    setter(true);
  } else {
    setter(false);
  }
}

export async function getCurrentAccount(setter: any) {
  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({ method: "eth_accounts" });
  if (accounts.length) {
    const account = accounts[0];
    setter(account);
  }
}

export function getProvider() {
  const ethereum = (window as any).ethereum;
  const provider = new ethers.providers.Web3Provider(ethereum);
  return provider;
}

export function getCardContract(provider: ethers.providers.Web3Provider) {
  const signer = provider.getSigner();
  return new ethers.Contract(
    REACT_APP_CARD_CONTRACT_ADDRESS,
    cardContractAbi,
    signer
  );
}

export function getTicketContract(provider: ethers.providers.Web3Provider) {
  const signer = provider.getSigner();
  return new ethers.Contract(
    REACT_APP_TICKET_CONTRACT_ADDRESS,
    ticketContractAbi,
    signer
  );
}
