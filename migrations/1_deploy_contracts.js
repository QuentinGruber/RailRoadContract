const RailRoadCard = artifacts.require("RailRoadCard");
const RailRoadTicket = artifacts.require("RailRoadTicket");

module.exports = function(deployer) {
  deployer.deploy(RailRoadCard);
  deployer.deploy(RailRoadTicket);
};
