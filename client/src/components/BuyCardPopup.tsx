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
import { buyCard } from "../contractsFunctions";
import { GradientButton } from "./GradientButton";

interface BuyCardPopupProps {
  open: boolean;
  actionHideBuyCardPopup: () => void;
  name: string;
  price: BigNumber;
  maxQuantity: number;
  saleBundleId: number;
}

export default function BuyCardPopup(props: BuyCardPopupProps) {
  const {
    open,
    actionHideBuyCardPopup,
    name,
    price,
    saleBundleId,
    maxQuantity,
  } = props;
  const [quantity, setQuantity] = useState(0);
  const cardContract = useSelector(
    (state) => (state as any).contracts.cardContract
  );
  return (
    <Dialog
      open={open}
      onClose={actionHideBuyCardPopup}
      PaperProps={{ className: "popup" }}
    >
      <DialogTitle className="popupTitle">Acheter la carte {name}</DialogTitle>
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
            <Typography
              variant="body2"
              color="text.secondary"
              className="popupUnitPrice"
            >
              {" "}
              Prix unitaire :{" "}
              <span className="popupPriceNumber">
                {ethers.utils.formatEther(price)} Ξ
              </span>
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            className="popupPriceNumberTypography"
          >
            {" "}
            Prix total :{" "}
            <span className="popupPriceNumber">
              {ethers.utils.formatEther(price.mul(quantity ? quantity : 0))} Ξ
            </span>
          </Typography>
        </DialogContentText>
      </DialogContent>
      <GradientButton
        onClick={() => buyCard(cardContract, saleBundleId, quantity, price)}
        type={"button"}
        text={"Valider"}
        className="popupConfirmButton"
      />
    </Dialog>
  );
}
