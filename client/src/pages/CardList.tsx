import { Box } from "@mui/material";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DiscountCard from "../components/DiscountCard";
import { HomeButton } from "../components/HomeButton";
import { getOnSaleCardList } from "../contractsFunctions";

export interface CardInSale {
  name: string;
  collectionId: number;
  saleBundleId?: number;
  price: BigNumber;
  quantity: number;
  totalQuantity: number;
  reduction: number;
  image?: string;
  desc?: string;
}

// prettier-ignore

export default function CardList() {
	const [cardList,setCardList] = useState<any[]>([])
	const cardContract = useSelector(state => (state as any).contracts.cardContract)
	useEffect(() => {
		if(!cardContract){
			return;
		}
		getOnSaleCardList(cardContract).then(setCardList)
  }, [cardContract]);
	return (
		<>
			<HomeButton />
			<h1>Liste des cartes</h1>
			<Box className="cardListcontainer">
				{cardList.map((card,index) => (
					<DiscountCard card={card} key={card.name + index} source="marketplace" />
				))}
			</Box>
		</>
	);
}
