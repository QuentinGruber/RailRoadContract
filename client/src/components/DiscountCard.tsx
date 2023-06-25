import {
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Card,
} from "@mui/material";
import { useState } from "react";
import BuyCardPopup from "./BuyCardPopup";
import SellCardPopup from "./SellCardPopup";
import { GradientButton } from "./GradientButton";
import TransferCardPopup from "./TransferCardPopup";
import { BigNumber, ethers } from "ethers";
import { CardInSale } from "../pages/CardList";

type source = "marketplace" | "inventory";

interface DiscountCardProps {
  card: CardInSale;
  source: source;
}

export default function DiscountCard(props: DiscountCardProps) {
  //state Quantity based on value of quantity input
  const [showBuyCardPopup, setShowBuyCardPopup] = useState(false);
  const [showSellCardPopup, setShowSellCardPopup] = useState(false);
  const [showTransferCardPopup, setShowTransferCardPopup] = useState(false);

  const { card, source } = props;

  const actionShowBuyCardPopup = () => {
    setShowBuyCardPopup(true);
  };
  const actionHideBuyCardPopup = () => {
    setShowBuyCardPopup(false);
  };

  const actionShowSellCardPopup = () => {
    setShowSellCardPopup(true);
  };
  const actionHideSellCardPopup = () => {
    setShowSellCardPopup(false);
  };

  const actionShowTransferCardPopup = () => {
    setShowTransferCardPopup(true);
  };
  const actionHideTransferCardPopup = () => {
    setShowTransferCardPopup(false);
  };

  return (
    <>
      {source === "marketplace" ? (
        <BuyCardPopup
          open={showBuyCardPopup}
          actionHideBuyCardPopup={actionHideBuyCardPopup}
          name={card.name}
          price={card.price}
          maxQuantity={card.quantity}
          saleBundleId={card.saleBundleId as number}
        />
      ) : (
        <>
          <SellCardPopup
            open={showSellCardPopup}
            actionHideSellCardPopup={actionHideSellCardPopup}
            name={card.name}
            maxQuantity={card.quantity}
            collectionId={card.collectionId}
          />
          <TransferCardPopup
            open={showTransferCardPopup}
            actionHideTransferCardPopup={actionHideTransferCardPopup}
            name={card.name}
            maxQuantity={card.quantity}
            collectionId={card.collectionId}
          />
        </>
      )}

      <Card className="cardContainer">
        <CardMedia
          component="img"
          height="180"
          image={card.image}
          alt={card.name}
        />
        <CardContent>
          <Typography variant="h5" className="cardTitle">
            {card.name} - {card.reduction}%
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="cardDescription"
          >
            {card.desc}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="cardReduction"
          >
            Réduction :{" "}
            <span className="cardReductionNumber">{card.reduction}%</span>
          </Typography>
          {source === "marketplace" && (
            <Typography
              variant="body2"
              color="text.secondary"
              className="cardPrice"
            >
              Prix :
              <span className="cardPriceNumber">
                {ethers.utils.formatEther(card.price)} Ξ
              </span>
            </Typography>
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            className="cardQuantity"
          >
            {source === "marketplace"
              ? "Quantité disponible"
              : "Quantité possédée"}{" "}
            :{" "}
            <span className="cardQuantityNumber">
              {card.quantity}/{card.totalQuantity}{" "}
            </span>
          </Typography>
        </CardContent>
        <CardActions className="cardFooter">
          {source === "marketplace" ? (
            <GradientButton
              onClick={actionShowBuyCardPopup}
              type="button"
              text="Acheter"
              className="cardButton"
            />
          ) : (
            <>
              <GradientButton
                onClick={actionShowSellCardPopup}
                type="button"
                text="Vendre"
                className="cardButton"
              />
              <GradientButton
                onClick={actionShowTransferCardPopup}
                type="button"
                text="Transférer"
                className="cardButton"
              />
            </>
          )}
        </CardActions>
      </Card>
    </>
  );
}
