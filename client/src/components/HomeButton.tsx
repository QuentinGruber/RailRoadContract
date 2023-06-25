import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
export function HomeButton() {
  return (
    <Link to="/">
      <Box className="homeButtonBox">
        <ChevronLeftIcon fontSize="large" className="homeButtonIcon" />
      </Box>
    </Link>
  );
}
