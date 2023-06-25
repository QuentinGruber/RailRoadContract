import { BigNumber, ethers } from "ethers";
import { Card, Collection, SaleBundle } from "./contractsStructsInterfaces";
import { CardInSale } from "./pages/CardList";

export async function getOnSaleCardList(
  cardContract: any
): Promise<CardInSale[]> {
  const activeSaleBundle: SaleBundle[] =
    await cardContract.getActiveSaleBundle();
  const serializedCardList: CardInSale[] = [];
  for (let i = 0; i < activeSaleBundle.length; i++) {
    const saleBundle = activeSaleBundle[i];
    const collection: Collection = await cardContract.getCollection(
      saleBundle.collectionId
    );
    const totalQuantity = saleBundle.cardIds.length;
    const { name } = collection;
    const desc = collection.description;
    const reduction = collection.reduction.toNumber();
    const price = saleBundle.price;
    const quantity = totalQuantity - saleBundle.soldedCards.toNumber();
    const image = collection.imageUrl;
    const collectionId = saleBundle.collectionId.toNumber();
    const saleBundleId = saleBundle.saleBundleId.toNumber();
    // debugger
    serializedCardList.push({
      name,
      collectionId,
      saleBundleId,
      desc,
      image,
      price,
      quantity,
      totalQuantity,
      reduction,
    });
  }
  return serializedCardList;
}

type t_collectionId = number;
interface ownedCollection {
  collectionId: t_collectionId;
  amount: number;
}

export async function getUserCardList(
  cardContract: any
): Promise<CardInSale[]> {
  const userOwnedCards: Card[] = await cardContract.getOwnedCards();
  const serializedCardList: CardInSale[] = [];
  const collectionsOwned: Record<t_collectionId, ownedCollection> = {};
  for (let i = 0; i < userOwnedCards.length; i++) {
    const userOwnedCard = userOwnedCards[i];
    const collectionId = userOwnedCard.collectionId.toNumber();
    const ownedCollection = collectionsOwned[collectionId];
    if (ownedCollection) {
      ownedCollection.amount++;
    } else {
      collectionsOwned[collectionId] = { collectionId, amount: 1 };
    }
  }
  const collectionOwnedValues = Object.values(collectionsOwned);
  for (let i = 0; i < collectionOwnedValues.length; i++) {
    const ownedCollection = collectionOwnedValues[i];
    const collection: Collection = await cardContract.getCollection(
      ownedCollection.collectionId
    );
    const totalQuantity = collection.amount.toNumber();
    const { name } = collection;
    const desc = collection.description;
    const reduction = collection.reduction.toNumber();
    // this value mean nothing on that context
    const price = BigNumber.from(0);
    const quantity = ownedCollection.amount;
    const image = collection.imageUrl;
    const collectionId = ownedCollection.collectionId;
    serializedCardList.push({
      name,
      collectionId,
      desc,
      image,
      price,
      quantity,
      totalQuantity,
      reduction,
    });
  }
  return serializedCardList;
}

export async function buyCard(
  cardContract: any,
  saleBundleId: number,
  count: number,
  price: BigNumber
) {
  const totalPrice = price.mul(count);
  await cardContract.buyCards(saleBundleId, count, { value: totalPrice });
}

export async function sendCardsFromCollection(
  cardContract: any,
  collectionId: number,
  recipient: string,
  amount: number
) {
  const userOwnedCards: Card[] = await cardContract.getOwnedCards();
  const cardsIdsToSent: BigNumber[] = [];
  for (let i = 0; i < userOwnedCards.length; i++) {
    const userOwnedCard = userOwnedCards[i];
    if (userOwnedCard.collectionId.toNumber() === collectionId) {
      cardsIdsToSent.push(userOwnedCard.tokenId);
      if (cardsIdsToSent.length === amount) {
        break;
      }
    }
  }
  if (cardsIdsToSent.length !== amount) {
    throw "Not enought cards to send";
  }
  await cardContract.sendCards(cardsIdsToSent, recipient);
}

export async function sellCardsFromCollection(
  cardContract: any,
  collectionId: number,
  amount: number,
  price: BigNumber
) {
  const userOwnedCards: Card[] = await cardContract.getOwnedCards();
  const cardsIdsToSell: BigNumber[] = [];
  for (let i = 0; i < userOwnedCards.length; i++) {
    const userOwnedCard = userOwnedCards[i];
    if (userOwnedCard.collectionId.toNumber() === collectionId) {
      cardsIdsToSell.push(userOwnedCard.tokenId);
      if (cardsIdsToSell.length === amount) {
        break;
      }
    }
  }
  if (cardsIdsToSell.length !== amount) {
    throw "Not enought cards to send";
  }
  await cardContract.putCardsInSell(collectionId, cardsIdsToSell, price);
}

export interface TicketGlobalData {
  price: BigNumber;
  maxAmount: number;
  reduction: number;
}
export async function getTicketGlobalData(
  ticketContract: any,
  cardContract: any
): Promise<TicketGlobalData> {
  const price: BigNumber = await ticketContract.TICKET_PRICE();
  const maxAmount: number = (
    (await ticketContract.MAX_TICKET_BUY_PER_TRANSAC()) as BigNumber
  ).toNumber();
  const reduction: number = (
    (await cardContract["getReduction()"]()) as BigNumber
  ).toNumber();
  return { price, maxAmount, reduction };
}

export enum TICKET_TYPE {
  TRAIN,
  BUS,
  SUBWAY,
}
export async function buyTickets(
  ticketContract: any,
  cardContract: any,
  count: number,
  ticketType: TICKET_TYPE,
  askedReduction: number
) {
  const price: BigNumber = await ticketContract.TICKET_PRICE();
  await ticketContract.buyTickets(
    cardContract.address,
    count,
    ticketType,
    askedReduction,
    { value: price.mul(count) }
  );
}

export async function createCollection(
  cardContract: any,
  collection: Collection,
  price: BigNumber
) {
  await cardContract.createCollection(collection, price);
}

export async function getUserTicketList(ticketContract: any) {
  return await ticketContract.getOwnedTickets();
}
