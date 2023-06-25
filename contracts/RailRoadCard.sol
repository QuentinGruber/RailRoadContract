// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract RailRoadCard is Ownable, ERC721Enumerable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    uint256 private constant MAX_REDUCTION = 100;
    struct Collection {
        string name;
        string description;
        string imageUrl;
        uint256 reduction;
        uint256 amount;
    }
    struct Card {
        uint256 collectionId;
        uint256 tokenId;
    }
    struct SaleBundle {
        uint256 saleBundleId;
        uint256 collectionId;
        uint256[] cardIds;
        uint256 price; //ether
        address owner;
        bool active;
        uint256 soldedCards;
    }
    Counters.Counter private _nextTokenId;
    Counters.Counter private _nextCollectionId;
    Counters.Counter private _nextSaleBundleId;
    mapping(uint256 => Card) private cards;
    mapping(uint256 => Collection) private collections;
    mapping(uint256 => SaleBundle) private saleBundles;
    uint256[] private activeSaleBundleIds;
    uint256 public constant royalities = 2;

    constructor() ERC721("RailRoadCard", "SRRC") {}

    function _mintNft(uint256 collectionId) private onlyOwner {
        uint256 tokenId = _nextTokenId.current();
        _nextTokenId.increment();
        cards[tokenId] = Card(collectionId, tokenId);
        _safeMint(address(this), tokenId);
    }

    function putCardsInSell(
        uint256 collectionId,
        uint256[] memory cardIds,
        uint256 price
    ) public payable {
        for (uint256 i = 0; i < cardIds.length; i++) {
            uint256 cardId = cardIds[i];
            require(ownerOf(cardId) == msg.sender, " You don't own that card");
            safeTransferFrom(msg.sender, address(this), cardId);
        }
        _sell(collectionId, cardIds, price);
    }

    function _sell(
        uint256 collectionId,
        uint256[] memory collectionCardsIds,
        uint256 price
    ) private {
        uint256 saleBundleId = _nextSaleBundleId.current();
        _nextSaleBundleId.increment();
        saleBundles[saleBundleId] = SaleBundle(
            saleBundleId,
            collectionId,
            collectionCardsIds,
            price,
            msg.sender,
            true,
            0
        );
        activeSaleBundleIds.push(saleBundleId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function getActiveSaleBundle() public view returns (SaleBundle[] memory) {
        SaleBundle[] memory activeSaleBundles = new SaleBundle[](
            activeSaleBundleIds.length
        );
        for (uint256 i = 0; i < activeSaleBundleIds.length; i++) {
            uint256 activeSaleBundleId = activeSaleBundleIds[i];
            SaleBundle memory saleBundle = saleBundles[activeSaleBundleId];
            if (saleBundle.active) {
                activeSaleBundles[i] = saleBundle;
            }
        }
        return activeSaleBundles;
    }

    function getCollection(uint256 collectionId)
        public
        view
        returns (Collection memory)
    {
        return collections[collectionId];
    }

    function getReduction(address owner) public view returns (uint256) {
        Card[] memory ownedCards = _getOwnedCards(owner);
        uint256 reduction = 0;
        for (uint256 i = 0; i < ownedCards.length; i++) {
            uint256 collectionId = ownedCards[i].collectionId;
            Collection memory collection = getCollection(collectionId);
            if (collection.reduction > reduction) {
                reduction = collection.reduction;
            }
        }
        return reduction;
    }

    function getReduction() public view returns (uint256) {
        return getReduction(msg.sender);
    }

    function createCollection(Collection memory collection, uint256 price)
        public
        onlyOwner
    {
        require(
            collection.reduction <= MAX_REDUCTION,
            "You can't set a reduction > 100"
        );
        require(
            collection.amount >= 1,
            "You can't create a collection of 0 card"
        );
        uint256 collectionId = _nextCollectionId.current();
        _nextCollectionId.increment();
        collections[collectionId] = collection;
        uint256[] memory collectionCardsIds = new uint256[](collection.amount);
        for (uint256 i = 0; i < collection.amount; i++) {
            collectionCardsIds[i] = _nextTokenId.current();
            _mintNft(collectionId);
        }
        _sell(collectionId, collectionCardsIds, price);
    }

    function sendCards(uint256[] calldata cardIds, address to) public payable {
        require(cardIds.length > 0, "Should send at least 1 card");
        for (uint256 i = 0; i < cardIds.length; i++) {
            uint256 cardIdToTransfer = cardIds[i];
            require(
                ownerOf(cardIdToTransfer) == msg.sender,
                "You don't own the card you try to send"
            );
            safeTransferFrom(msg.sender, to, cardIdToTransfer);
        }
    }

    function buyCards(uint256 saleBundleId, uint256 count) public payable {
        require(count > 0, "Should buy at least 1 card");
        require(
            saleBundles[saleBundleId].active,
            "The provided saleBundleId doesn't exist"
        );
        SaleBundle memory saleBundle = saleBundles[saleBundleId];
        uint256 cardsLefts = saleBundle.cardIds.length - saleBundle.soldedCards;
        require(count <= cardsLefts, "Not enought cards lefts");
        require(saleBundle.price <= msg.value, "too poor");
        for (uint256 i = saleBundle.soldedCards; i < count; i++) {
            uint256 cardIdToTransfer = saleBundle.cardIds[i];
            _approve(msg.sender, cardIdToTransfer);
            safeTransferFrom(address(this), msg.sender, cardIdToTransfer);
        }
        saleBundle.soldedCards += count;
        if (count == cardsLefts) {
            saleBundle.active = false;
            uint256 newLen = activeSaleBundleIds.length - 1;
            uint256[] memory updatedActiveSaleBundleIds = new uint256[](newLen);
            uint256 indexFix = 0;
            for (uint256 i = 0; i < activeSaleBundleIds.length; i++) {
                uint256 activeSaleBundleId = activeSaleBundleIds[i];
                if (activeSaleBundleId != saleBundleId) {
                    updatedActiveSaleBundleIds[
                        i - indexFix
                    ] = activeSaleBundleId;
                } else {
                    indexFix = 1;
                }
            }
            activeSaleBundleIds = updatedActiveSaleBundleIds;
        }
        saleBundles[saleBundleId] = saleBundle; // save the updated saleBundle
        if (saleBundle.owner == owner()) {
            payable(owner()).transfer(msg.value);
        } else {
            uint256 ownerRoyalities = (msg.value * (royalities / 100)) / 100;
            payable(saleBundle.owner).transfer(msg.value - ownerRoyalities);
            payable(owner()).transfer(ownerRoyalities);
        }
    }

    function _getOwnedCards(address owner)
        private
        view
        returns (Card[] memory)
    {
        uint256 ownedTokenIds = ERC721.balanceOf(owner);
        Card[] memory ownedCards = new Card[](ownedTokenIds);
        for (uint256 i = 0; i < ownedTokenIds; i++) {
            uint256 ownedTokenId = tokenOfOwnerByIndex(owner, i);
            Card memory ownedCard = cards[ownedTokenId];
            ownedCards[i] = ownedCard;
        }
        return ownedCards;
    }

    function getOwnedCards() public view returns (Card[] memory) {
        return _getOwnedCards(msg.sender);
    }
}
