import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import { TICKET_TYPE } from "../contractsFunctions";

interface ticket {
  vehicle: TICKET_TYPE;
}

export default function InventoryTicket(props: ticket) {
  const { vehicle } = props;

  function switchVehicle(vehicle: TICKET_TYPE) {
    switch (vehicle) {
      case TICKET_TYPE.TRAIN:
        return <TrainIcon className="userTicketIcon" />;
      case TICKET_TYPE.BUS:
        return <DirectionsBusIcon className="userTicketIcon" />;
      case TICKET_TYPE.SUBWAY:
        return <DirectionsSubwayIcon className="userTicketIcon" />;
      default:
        return;
    }
  }

  return (
    <Card className="userTicketContainer">
      <CardContent>
        {switchVehicle(vehicle)}
        <Typography variant="h5" className="cardTitle">
          Ticket de {TICKET_TYPE[vehicle]}
        </Typography>
      </CardContent>
    </Card>
  );
}
