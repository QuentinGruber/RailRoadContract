import { Box } from "@mui/material";
import InventoryTicket from "../components/InventoryTicket";
import { HomeButton } from "../components/HomeButton";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserTicketList } from "../contractsFunctions";
import { Ticket } from "../contractsStructsInterfaces";

export default function CardList() {
  const [ticketList, setTicketList] = useState<Ticket[]>([]);
  const ticketContract = useSelector(
    (state) => (state as any).contracts.ticketContract
  );
  useEffect(() => {
    if (!ticketContract) {
      return;
    }
    getUserTicketList(ticketContract).then(setTicketList);
  }, [ticketContract]);
  return (
    <>
      <HomeButton />
      <h1>Mes tickets</h1>
      <Box className="ticketListcontainer">
        {ticketList.map((ticket,index) => (
          <InventoryTicket key={"ticket"+index} vehicle={ticket.ticketType} />
        ))}
      </Box>
    </>
  );
}
