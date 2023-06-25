import { BigNumber } from "ethers";
import { TICKET_TYPE } from "./contractsFunctions";

export interface Collection {
  name: string;
  description: string;
  imageUrl: string;
  reduction: BigNumber;
  amount: BigNumber;
}
export interface Card {
  collectionId: BigNumber;
  tokenId: BigNumber;
}
export interface SaleBundle {
  saleBundleId: BigNumber;
  collectionId: BigNumber;
  cardIds: BigNumber[];
  price: BigNumber;
  owner: string;
  soldedCards: BigNumber;
}

export interface Ticket {
  ticketType: TICKET_TYPE;
}
