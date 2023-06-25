const RailRoadCard = artifacts.require("RailRoadCard");

const oneEther = web3.utils.toWei("1", "ether");
const collectionSample = {
  name: "cool",
  description: "tropcool",
  reduction: 20,
  imageUrl: "url",
  amount: 2,
};
async function createCollection(RailRoadCardInstance) {
  await RailRoadCardInstance.createCollection.sendTransaction(
    collectionSample,
    oneEther
  );
}
exports.createCollection = createCollection;
exports.collectionSample = collectionSample;
contract("RailRoadCard", async (accounts) => {
  it("Owner create collection", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    await createCollection(RailRoadCardInstance);
    const saleBundles =
      await RailRoadCardInstance.getActiveSaleBundle.call();
    const saleBundle = saleBundles[0];
    assert.equal(
      saleBundle.cardIds.length,
      collectionSample.amount,
      "Number of cards in sale do not match"
    );
    assert.equal(saleBundle.price, oneEther, "Price do not match");
    const collection = await RailRoadCardInstance.getCollection.call(
      saleBundle.collectionId
    );
    assert.equal(
      collection.name,
      collectionSample.name,
      "Collection name do not match"
    );
  });
  it("Fail to create a collection with reduction > 100", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    try {
      await RailRoadCardInstance.createCollection.sendTransaction(
        { ...collectionSample, reduction: 500 },
        oneEther
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(
      hasErrored,
      true,
      "Created collection with a reduction > 100%"
    );
  });
  it("Fail to buy cards due to low amount", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const ethSend = oneEther / 2;
    try {
      await RailRoadCardInstance.buyCards.sendTransaction(
        0,
        collectionSample.amount,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(hasErrored, true, "Bought cards without enought eth");
  });
  it("Fail to buy cards due to falsy saleBundleId", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const ethSend = oneEther;
    try {
      await RailRoadCardInstance.buyCards.sendTransaction(
        1337,
        collectionSample.amount,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(hasErrored, true, "Bought cards from a falsy saleBundleId");
  });
  it("Fail to buy cards due to falsy count", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    let hasErrored = false;
    const ethSend = oneEther * 2;
    try {
      await RailRoadCardInstance.buyCards.sendTransaction(
        0,
        collectionSample.amount * 2,
        { value: ethSend }
      );
    } catch (e) {
      hasErrored = true;
    }
    assert.equal(hasErrored, true, "Bought more cards than available");
  });
  it("Buy all cards from collectionSample", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const alreadyOwnedCards =
      await RailRoadCardInstance.getOwnedCards.call();
    await RailRoadCardInstance.buyCards.sendTransaction(
      0,
      collectionSample.amount,
      { value: oneEther * collectionSample.amount }
    );
    const ownedCards = await RailRoadCardInstance.getOwnedCards.call();
    assert.equal(
      ownedCards.length - alreadyOwnedCards.length,
      collectionSample.amount,
      "Owned cards count do not match"
    );
  });
  it("Get reduction with cards", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const reduction = await RailRoadCardInstance.getReduction.call();
    assert.equal(reduction, collectionSample.reduction, "wrong reduction");
  });
  it("Send a card", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const ownerOwnedCards = await RailRoadCardInstance.getOwnedCards.call();
    const receiverAccount = accounts[1];
    const receiverAlreadyOwnedCards =
      await RailRoadCardInstance.getOwnedCards.call({
        from: receiverAccount,
      });
    const ownerSendCardIds = ownerOwnedCards.map((e) => {
      return e.tokenId;
    });
    await RailRoadCardInstance.sendCards.sendTransaction(
      ownerSendCardIds,
      receiverAccount
    );
    const receiverOwnedCards = await RailRoadCardInstance.getOwnedCards.call(
      { from: receiverAccount }
    );
    assert.equal(
      receiverOwnedCards.length - receiverAlreadyOwnedCards.length,
      ownerOwnedCards.length,
      "Receiver miss some cards"
    );
    const ownerOwnedCardsAfter =
      await RailRoadCardInstance.getOwnedCards.call();
    assert.equal(ownerOwnedCardsAfter.length, 0, "owner didn't send his cards");
  });
  it("Get reduction without cards", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const reduction = await RailRoadCardInstance.getReduction.call();
    assert.equal(reduction, 0, "wrong reduction");
  });
  it("Put cards in sell", async () => {
    const RailRoadCardInstance = await RailRoadCard.deployed();
    const otherAccount = accounts[1];
    const OtherAccountOwnedCards =
      await RailRoadCardInstance.getOwnedCards.call({ from: otherAccount });
    const otherAccountCardIds = OtherAccountOwnedCards.map((e) => {
      return e.tokenId;
    });
    await RailRoadCardInstance.putCardsInSell.sendTransaction(
      "0",
      otherAccountCardIds,
      2,
      { from: otherAccount }
    );
    const otherAccountOwnedCardsAfter =
      await RailRoadCardInstance.getOwnedCards.call({ from: otherAccount });
    assert.equal(
      otherAccountOwnedCardsAfter.length,
      0,
      "other account didn't send his cards"
    );
    const saleBundles =
      await RailRoadCardInstance.getActiveSaleBundle.call();
    const saleBundle = saleBundles[0];
    assert.equal(saleBundle.price, 2, "wrong price set");
    assert.equal(
      saleBundle.cardIds.length,
      otherAccountCardIds.length,
      "wrong number of cards put in sell"
    );
  });
});
