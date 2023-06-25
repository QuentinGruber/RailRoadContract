import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DiscountCard from "../components/DiscountCard";
import { HomeButton } from "../components/HomeButton";
import { getUserCardList } from "../contractsFunctions";
import { CardInSale } from "./CardList";

export default function CardList() {
  const [cardList, setCardList] = useState<CardInSale[]>([]);
  const cardContract = useSelector(
    (state) => (state as any).contracts.cardContract
  );
  useEffect(() => {
    if (!cardContract) {
      return;
    }
    getUserCardList(cardContract).then(setCardList);
  }, [cardContract]);
  return (
    <>
      <HomeButton />
      <h1>Mes cartes</h1>
      <Box className="cardListcontainer">
        {cardList.map((card, index) => (
          <DiscountCard
            key={card.name + index}
            card={card}
            source="inventory"
          />
        ))}
      </Box>
    </>
  );
}
