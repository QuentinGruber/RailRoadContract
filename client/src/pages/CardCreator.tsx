import { Box, Card, TextField } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GradientButton } from "../components/GradientButton";
import { HomeButton } from "../components/HomeButton";
import { createCollection } from "../contractsFunctions";
import { Collection } from "../contractsStructsInterfaces";

export default function CardCreator() {
  const cardContract = useSelector(
    (state) => (state as any).contracts.cardContract
  );
  const [collection, setCollection] = useState<Collection>({
    name: "",
    description: "",
    amount: BigNumber.from(0),
    reduction: BigNumber.from(0),
    imageUrl: "",
  } as unknown as Collection);
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  return (
    <>
      <HomeButton />
      <h1>Créer une carte</h1>
      <Card className="cardCreatorContainer">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          Nouvelle carte
        </Box>
        <Box component="form" className="cardCreatorForm">
          <TextField
            className="cardCreatorField"
            required
            id="outlined-required"
            label="Nom"
            onChange={(e) => {
              setCollection({ ...collection, name: e.target.value });
            }}
          />
          <TextField
            className="cardCreatorField"
            type={"number"}
            inputProps={{
              step: "0.01",
              min: "0",
            }}
            required
            id="outlined-required"
            label="Prix (Ξ)"
            onChange={(e) => {
              setPrice(BigNumber.from(ethers.utils.parseEther(e.target.value)));
            }}
          />
          <TextField
            className="cardCreatorField"
            type={"number"}
            inputProps={{
              min: "0",
            }}
            required
            id="outlined-required"
            label="Quantité disponible"
            onChange={(e) => {
              setCollection({
                ...collection,
                amount: BigNumber.from(e.target.value),
              });
            }}
          />
          <TextField
            className="cardCreatorField"
            type={"number"}
            inputProps={{
              min: "0",
            }}
            required
            id="outlined-required"
            label="Pourcentage de réduction"
            onChange={(e) => {
              setCollection({
                ...collection,
                reduction: BigNumber.from(e.target.value),
              });
            }}
          />
          <TextField
            name="upload-photo"
            type="text"
            inputProps={{ accept: "image/*" }}
            className="cardCreatorField"
            label="Url de l'image"
            onChange={(e) => {
              setCollection({ ...collection, imageUrl: e.target.value });
            }}
          />
          <TextField
            multiline
            className="cardCreatorField"
            id="outlined-basic"
            label="Description"
            onChange={(e) => {
              setCollection({ ...collection, description: e.target.value });
            }}
          />
          <GradientButton
            onClick={() => createCollection(cardContract, collection, price)}
            type="button"
            text="Créer"
            className="cardCreatorButtonSubmit"
          />
        </Box>
      </Card>
    </>
  );
}
