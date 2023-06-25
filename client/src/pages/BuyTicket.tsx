import { Box, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { GradientButton } from "../components/GradientButton";
import { HomeButton } from "../components/HomeButton";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import { useSelector } from "react-redux";
import {
  buyTickets,
  getTicketGlobalData,
  TicketGlobalData,
  TICKET_TYPE,
} from "../contractsFunctions";
import { BigNumber, ethers } from "ethers";

export default function BuyTicket() {
  const [ticketPrice, setTicketPrice] = useState(BigNumber.from(0));
  const [cardDiscount, setCardDiscount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(TICKET_TYPE.TRAIN);
  const cardContract = useSelector(
    (state) => (state as any).contracts.cardContract
  );
  const ticketContract = useSelector(
    (state) => (state as any).contracts.ticketContract
  );

  useEffect(() => {
    if (!cardContract || !ticketContract) {
      return;
    }
    getTicketGlobalData(ticketContract, cardContract).then(
      (data: TicketGlobalData) => {
        setTicketPrice(data.price);
        setCardDiscount(data.reduction);
        setMaxQuantity(data.maxAmount);
      }
    );
  }, [ticketContract, cardContract]);
  return (
    <>
      <HomeButton />
      <h1>Acheter un ticket</h1>
      <Card
        className="cardCreatorContainer"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h4" className="buyTicketTitle">
          Mode de transport
        </Typography>
        <Box className="buyOptionContainer">
          <Box
            className={
              selectedTicket === TICKET_TYPE.TRAIN
                ? "buyOptionBox buyOptionBoxSelected"
                : "buyOptionBox"
            }
            onClick={() => {
              setSelectedTicket(TICKET_TYPE.TRAIN);
            }}
          >
            <TrainIcon className="buyOptionIcon" />
            <Typography className="buyOptionText">Train</Typography>
          </Box>
          <Box
            className={
              selectedTicket === TICKET_TYPE.BUS
                ? "buyOptionBox buyOptionBoxSelected"
                : "buyOptionBox"
            }
            onClick={() => {
              setSelectedTicket(TICKET_TYPE.BUS);
            }}
          >
            <DirectionsBusIcon className="buyOptionIcon" />
            <Typography className="buyOptionText">Bus</Typography>
          </Box>
          <Box
            className={
              selectedTicket === TICKET_TYPE.SUBWAY
                ? "buyOptionBox buyOptionBoxSelected"
                : "buyOptionBox"
            }
            onClick={() => {
              setSelectedTicket(TICKET_TYPE.SUBWAY);
            }}
          >
            <DirectionsSubwayIcon className="buyOptionIcon" />
            <Typography className="buyOptionText">Métro</Typography>
          </Box>
        </Box>
        <Box>
          Prix du ticket :{" "}
          {cardDiscount ? (
            <>
              <span className="buyTicketOriginalPrice">
                {ethers.utils.formatEther(ticketPrice)}
              </span>
              <span className="buyTicketNewPrice">
                <>
                  {" "}
                  {ethers.utils.formatEther(
                    ticketPrice.sub(ticketPrice.mul(cardDiscount).div(100))
                  )}{" "}
                  Ξ
                </>
              </span>
              <span className="buyTicketDiscount">
                {" "}
                Réduction : {cardDiscount}%
              </span>
            </>
          ) : (
            <span className="buyTicketPrice">
              {ethers.utils.formatEther(ticketPrice)} Ξ
            </span>
          )}
        </Box>
        <Box className="buyQuantityContainer">
          <TextField
            label="Quantité"
            type={"number"}
            inputProps={{
              min: 0,
              max: maxQuantity,
            }}
            className="popupInput"
            size="small"
            variant="standard"
            onChange={(e) => {
              setQuantity(parseInt(e.target.value));
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            className="popupUnitPrice"
          >
            {" "}
            Prix total :{" "}
            <span className="popupPriceNumber">
              <>
                {ethers.utils.formatEther(
                  ticketPrice
                    .sub(ticketPrice.mul(cardDiscount).div(100))
                    .mul(quantity)
                )}{" "}
                Ξ
              </>
            </span>
          </Typography>
        </Box>
        <GradientButton
          onClick={() => {
            buyTickets(
              ticketContract,
              cardContract,
              quantity,
              selectedTicket,
              cardDiscount
            );
          }}
          type="button"
          text="Acheter"
          className="cardCreatorButtonSubmit"
        />
      </Card>
    </>
  );
}
