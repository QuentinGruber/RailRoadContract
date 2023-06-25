import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { sendCardsFromCollection } from "../contractsFunctions";
import { GradientButton } from "./GradientButton";

interface TransferCardPopupProps {
  open: boolean;
  actionHideTransferCardPopup: () => void;
  name: string;
  maxQuantity: number;
  collectionId: number;
}

export default function TransferCardPopup(props: TransferCardPopupProps) {
  const { open, collectionId, actionHideTransferCardPopup, name, maxQuantity } =
    props;
  const [quantity, setQuantity] = useState(0);
  const [recipient, setRecipient] = useState("");
  const cardContract = useSelector(
    (state) => (state as any).contracts.cardContract
  );
  return (
    <Dialog
      open={open}
      onClose={actionHideTransferCardPopup}
      PaperProps={{ className: "popup" }}
    >
      <DialogTitle className="popupTitle">
        Transférer la carte {name}
      </DialogTitle>
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
              className="popupInput25"
              size="small"
              variant="standard"
              onChange={(e) => {
                setQuantity(parseInt(e.target.value));
              }}
            />
            <TextField
              label="Destinataire"
              className="popupInput65"
              size="small"
              variant="standard"
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <GradientButton
        onClick={() =>
          sendCardsFromCollection(
            cardContract,
            collectionId,
            recipient,
            quantity
          )
        }
        type={"button"}
        text={"Valider"}
        className="popupConfirmButton"
      />
    </Dialog>
  );
}
