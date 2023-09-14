import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import TripCard from "./TripCard/TripCard";
import './TripsPage.css';
import { Fab, Paper, Stack, styled } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";
import { generatePath, useNavigate } from "react-router-dom";
import { useScrollDirection } from 'react-use-scroll-direction'

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,

}));

let email = localStorage.getItem("email") || "";


const GET_DATA = gql`
query {
  user(email: "${email}") {
    firstName
    email
    trips {
      id
      name
      description
      startDate
      endDate
      }
    }
  }

`;

function TripsPage(props, { email }) {
    const { loading, error, data } = useQuery(GET_DATA);
    const [extended, setExtended] = useState(true);
    const [newtrip, setNewTrip] = useState(true);

    const { isScrollingUp, isScrollingDown } = useScrollDirection()

    let ext = extended ? "extended" : "circular";
    let nt = newtrip ? 'New Trip' : "";

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingUp) {
                setExtended(true);
                setNewTrip(true);
            }
            if (isScrollingDown) {
                setExtended(false);
                setNewTrip(false);

            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrollingUp, isScrollingDown])


    const navigate = useNavigate();

    const handleClick = (event) => {
        let tripid = event.currentTarget.id
        const objtt = data?.user?.trips.find(obj => obj.id === tripid)
        const probj = JSON.stringify(objtt)
        navigate(`/trip/${tripid}`)
    };

    const handleNewTrip = () => {
        console.log("New trip");
    }

    if (loading) return <div> <CircularProgress /> </div>;
    if (error) {
        try {
            if (localStorage.getItem("email").length !== 0){
                return <h1>Error: {error.message}</h1>
            } 
            return <h1> Error: Make sure to log in</h1>
        } catch {
            return <h1> Error: Make sure to log in</h1>
        }
    }

    return (
        <>
            <div className={"GroupStack"} >
                <Fab color="primary" onClick={handleNewTrip} aria-label="add" className={"NewTripFab"} id={"NewTrip"} variant={ext}>
                    <AddIcon /> <div id={"NewTripText"} >{nt}</div>
                </Fab>

                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    overflow={"scroll"}
                    sx={{ mx: 2, mt: '90px' }}
                >

                    <React.Fragment>

                        {data?.user?.trips?.map((trip) => (
                            <Item id={trip.id} key={trip.id} trip={trip} onClick={handleClick}>
                                <TripCard trip={trip} />
                            </Item>
                        ))}

                    </React.Fragment>
                </Stack>
            </div>

        </>
    );
}


export default TripsPage;
