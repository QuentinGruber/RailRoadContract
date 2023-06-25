const { createCollection, collectionSample } = require("./RailRoadCard.js");
const RailRoadTicket = artifacts.require("RailRoadTicket");
const RailRoadCard = artifacts.require("RailRoadCard");

const TICKET_TYPE = { TRAIN: 0, BUS: 1, SUBWAY: 2 };
const oneEther = web3.utils.toWei("1", "ether");
let MAX_TICKET_BUY_PER_TRANSAC;
let TICKET_PRICE;
async function initVars() {
  const RailRoadTicketInstance = await RailRoadTicket.deployed();
  TICKET_PRICE = await RailRoadTicketInstance.TICKET_PRICE.call();
  MAX_TICKET_BUY_PER_TRANSAC =
    await RailRoadTicketInstance.MAX_TICKET_BUY_PER_TRANSAC.call();
}
contract("RailRoadTicket", async (accounts) => {
  it("init vars", async () => {
    await initVars();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    await createCollection(RailRoadCardInstance);
    assert.notEqual(TICKET_PRICE, undefined, "Fail to get ticket price");
  });
  it("Buy train ticket", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const ethSend = TICKET_PRICE;
    mintResult = await RailRoadTicketInstance.buyTickets.sendTransaction(
      RailRoadCardInstance.address,
      1,
      TICKET_TYPE.TRAIN,
      0,
      { value: ethSend }
    );
    assert.equal(mintResult.receipt.status, true, "Fail to mint");
  });
  it("Buy multiple train tickets", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const nbTicketsToBuy = 3;
    const ethSend = TICKET_PRICE * nbTicketsToBuy;
    mintResult = await RailRoadTicketInstance.buyTickets.sendTransaction(
      RailRoadCardInstance.address,
      nbTicketsToBuy,
      TICKET_TYPE.TRAIN,
      0,
      { value: ethSend }
    );
    assert.equal(mintResult.receipt.status, true, "Fail to mint");
  });
  it("getOwnedTickets", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const balanceOfAccountBeforeTest =
      await RailRoadTicketInstance.balanceOf.call(accounts[0]);
    const nbTicketsToBuy = 2;
    const ethSend = TICKET_PRICE * nbTicketsToBuy;
    await RailRoadTicketInstance.buyTickets.sendTransaction(
      RailRoadCardInstance.address,
      nbTicketsToBuy,
      TICKET_TYPE.TRAIN,
      0,
      { value: ethSend }
    );
    const ownedTickets = await RailRoadTicketInstance.getOwnedTickets.call();
    const accountBalanceBeforeTest = balanceOfAccountBeforeTest.words[0];
    assert.equal(
      ownedTickets.length - accountBalanceBeforeTest,
      nbTicketsToBuy,
      "Owned tickets count do not match"
    );
  });
  it("check owned tickets types", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const ethSend = TICKET_PRICE * 2;
    const balanceOfAccountBeforeTest =
      await RailRoadTicketInstance.balanceOf.call(accounts[0]);
    const accountBalanceBeforeTest = balanceOfAccountBeforeTest.words[0];
    await RailRoadTicketInstance.buyTickets.sendTransaction(
      RailRoadCardInstance.address,
      1,
      TICKET_TYPE.TRAIN,
      0,
      { value: ethSend }
    );
    await RailRoadTicketInstance.buyTickets.sendTransaction(
      RailRoadCardInstance.address,
      1,
      TICKET_TYPE.BUS,
      0,
      { value: ethSend }
    );
    const ownedTickets = await RailRoadTicketInstance.getOwnedTickets.call();
    assert.equal(
      ownedTickets[accountBalanceBeforeTest],
      TICKET_TYPE.TRAIN,
      "Ticket type should be train"
    );
    assert.equal(
      ownedTickets[accountBalanceBeforeTest + 1],
      TICKET_TYPE.BUS,
      "Ticket type should be bus"
    );
  });
  it("Fail to buy a ticket due to low amount", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const ethSend = TICKET_PRICE / 2;
    try {
      await RailRoadTicketInstance.buyTickets.sendTransaction(
        RailRoadCardInstance.address,
        1,
        TICKET_TYPE.TRAIN,
        0,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(hasErrored, true, "Bought a ticket without enough eth");
  });
  it("Fail to buy multiple tickets due to low amount", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const nbTicketsToBuy = 8;
    const ethSend = (TICKET_PRICE * nbTicketsToBuy) / 2;
    try {
      await RailRoadTicketInstance.buyTickets.sendTransaction(
        RailRoadCardInstance.address,
        nbTicketsToBuy,
        TICKET_TYPE.TRAIN,
        0,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(
      hasErrored,
      true,
      "Bought multiple tickets without enough eth"
    );
  });
  it("Fail to buy ticket due to 0 count", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const ethSend = TICKET_PRICE;
    try {
      await RailRoadTicketInstance.buyTickets.sendTransaction(
        RailRoadCardInstance.address,
        0,
        TICKET_TYPE.TRAIN,
        0,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(hasErrored, true, "Bought a ticket with count 0");
  });
  it("Fail to buy ticket due to MAX_TICKET_PER_TRANSAC", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const nbTicketsToBuy = MAX_TICKET_BUY_PER_TRANSAC + 1;
    const ethSend = TICKET_PRICE * nbTicketsToBuy;
    try {
      await RailRoadTicketInstance.buyTickets.sendTransaction(
        RailRoadCardInstance.address,
        nbTicketsToBuy,
        TICKET_TYPE.TRAIN,
        0,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(hasErrored, true, "Bought a ticket with a too high count");
  });
  it("Fail to buy a ticket due to wrong reduction", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const nbTicketsToBuy = 1;
    const ethSend = TICKET_PRICE * nbTicketsToBuy;
    try {
      await RailRoadTicketInstance.buyTickets.sendTransaction(
        RailRoadCardInstance.address,
        nbTicketsToBuy,
        TICKET_TYPE.TRAIN,
        10,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(
      hasErrored,
      true,
      "Bought a ticket without the right reduction"
    );
  });
  it("Buy a card and buy a ticket with reduction", async () => {
    const RailRoadTicketInstance = await RailRoadTicket.deployed();
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const nbCardsToBuy = 1;
    let ethSend = oneEther * nbCardsToBuy;
    await RailRoadCardInstance.buyCards.sendTransaction(0, 1, {
      value: oneEther * nbCardsToBuy,
    });
    const reduction = await RailRoadCardInstance.getReduction.call();
    assert.equal(reduction, collectionSample.reduction, "wrong reduction");
    const nbTicketsToBuy = 2;
    ethSend =
      TICKET_PRICE * nbTicketsToBuy -
      TICKET_PRICE * nbTicketsToBuy * (reduction / 100);
    await RailRoadTicketInstance.buyTickets.sendTransaction(
      RailRoadCardInstance.address,
      nbTicketsToBuy,
      TICKET_TYPE.TRAIN,
      reduction,
      { value: ethSend }
    );
  });
});
