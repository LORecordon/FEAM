import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';


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

export async function UserTrips({setTrips, setLoadingTrips}) {
    const { loading, error, data } = useQuery(GET_DATA);

    // wait for data to load before setting trips
    useEffect(() => {
        // Check if data has been loaded
        if (!loading && !error && data) {
            // Set the trips and loading state here
            setTrips(data.user.trips);
            setLoadingTrips(false);
        }
    }, [loading, error, data, setTrips, setLoadingTrips]);
}