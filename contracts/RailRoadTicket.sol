// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./RailRoadCard.sol";

contract RailRoadTicket is Ownable, ERC721Enumerable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    enum TICKET_TYPE {
        TRAIN,
        BUS,
        SUBWAY
    }
    struct Ticket {
        TICKET_TYPE ticketType;
    }
    Counters.Counter private _nextTokenId;
    uint256 public constant TICKET_PRICE = 0.069 ether;
    uint256 public constant MAX_TICKET_BUY_PER_TRANSAC = 10;
    mapping(uint256 => Ticket) private tickets;

    constructor() ERC721("RailRoadTicket", "SRRT") {}

    function _mintNft(TICKET_TYPE ticketType) private {
        uint256 tokenId = _nextTokenId.current();
        _nextTokenId.increment();
        tickets[tokenId] = Ticket(ticketType);
        _safeMint(msg.sender, tokenId);
    }

    function buyTickets(
        RailRoadCard railRoadCardInstance,
        uint256 count,
        TICKET_TYPE ticketType,
        uint256 askedReduction
    ) public payable {
        require(count > 0, "Should buy at least 1 ticket");
        require(
            railRoadCardInstance.getReduction(msg.sender) == askedReduction,
            "Wrong asked reduction"
        );
        require(
            count <= MAX_TICKET_BUY_PER_TRANSAC,
            "Can't buy more than 10 tickets at a time"
        );
        uint256 totalPrice = TICKET_PRICE.mul(count);
        uint256 reductionAmount = (totalPrice * askedReduction) / 100;
        uint256 finalPrice = totalPrice - reductionAmount;
        require(msg.value >= finalPrice, "Not enougth eth");
        for (uint256 i = 0; i < count; i++) {
            _mintNft(ticketType);
        }
        payable(owner()).transfer(msg.value);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        // allow only mint transfer
        require(from == address(0), "Cannot transfer tickets");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function getOwnedTickets() public view returns (Ticket[] memory) {
        address owner = msg.sender;
        uint256 ownedTokenIds = ERC721.balanceOf(owner);
        Ticket[] memory ownedTickets = new Ticket[](ownedTokenIds);
        for (uint256 i = 0; i < ownedTokenIds; i++) {
            uint256 ownedTokenId = tokenOfOwnerByIndex(owner, i);
            Ticket memory ownedTicket = tickets[ownedTokenId];
            ownedTickets[i] = ownedTicket;
        }
        return ownedTickets;
    }
}
