import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Accueil() {
  return (
    <>
      <h1>RailRoad & co</h1>
      <Box className="homeLinkContainer">
        <Link to="/card-creator" className="homeLink">
          <Box className="homeLinkBox">Créer une carte</Box>
        </Link>
        <Link to="/card-list" className="homeLink">
          <Box className="homeLinkBox">Liste des cartes</Box>
        </Link>
        <Link to="/my-cards" className="homeLink">
          <Box className="homeLinkBox">Mes cartes</Box>
        </Link>
        <Link to="/buy-ticket" className="homeLink">
          <Box className="homeLinkBox">Acheter un ticket</Box>
        </Link>
        <Link to="/my-tickets" className="homeLink">
          <Box className="homeLinkBox">Mes tickets</Box>
        </Link>
      </Box>
      <Box className="creditsContainer">
        Réalisé par :
        <Box className="creditsNames">
          Quentin GRUBER, Maxime BIER, Aurélie DUPREZ
        </Box>
      </Box>
    </>
  );
}
