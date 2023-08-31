import React from "react";
import SpinnerOfDoom from './SpinnerOfDoom';
import {Box} from "@mui/material";
import theme from "../../theme";

function HomePage(props) {
  return (
    <Box>
        < SpinnerOfDoom color={'primary.main'} />
    </Box>
  );
}

export default HomePage;