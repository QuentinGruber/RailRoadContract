import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { useSelector } from "react-redux";
import { sellCardsFromCollection } from "../contractsFunctions";
import { GradientButton } from "./GradientButton";

interface SellCardPopupProps {
  open: boolean;
  actionHideSellCardPopup: () => void;
  name: string;
  maxQuantity: number;
  collectionId: number;
}

export default function SellCardPopup(props: SellCardPopupProps) {
  const { open, actionHideSellCardPopup, collectionId, name, maxQuantity } =
    props;
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const cardContract = useSelector(
    (state) => (state as any).contracts.cardContract
  );
  return (
    <Dialog
      open={open}
      onClose={actionHideSellCardPopup}
      PaperProps={{ className: "popup" }}
    >
      <DialogTitle className="popupTitle">Vendre la carte {name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Quantité disponible : {maxQuantity}
          <Box className="popupInputsContainer">
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
            <TextField
              label="Prix unitaire (Ξ)"
              type={"number"}
              inputProps={{
                min: 0,
                step: 0.01,
              }}
              className="popupInput"
              size="small"
              variant="standard"
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
            />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            className="popupPriceNumberTypography"
          >
            {" "}
            Prix total :{" "}
            <span className="popupPriceNumber">
              {((price ? price : 0) * (quantity ? quantity : 0)).toFixed(2)} Ξ
            </span>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <GradientButton
        onClick={() =>
          sellCardsFromCollection(
            cardContract,
            collectionId,
            quantity,
            ethers.utils.parseEther(price.toString())
          )
        }
        type={"button"}
        text={"Valider"}
        className="popupConfirmButton"
      />
    </Dialog>
  );
}
