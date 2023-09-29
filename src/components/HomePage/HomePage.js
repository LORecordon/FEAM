import React, {useEffect} from "react";
import SpinnerOfDoom from './SpinnerOfDoom';
import {Box} from "@mui/material";
import theme from "../../theme";
import { API_URL } from "../../constants";
import { useLocation } from "react-router-dom";

function HomePage(props) {


  return (
    <Box>
        < SpinnerOfDoom color={'primary.main'} />
    </Box>
  );
}

export default HomePage;