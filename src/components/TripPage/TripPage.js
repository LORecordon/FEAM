import { useParams } from "react-router-dom"
import React, { useEffect, useState } from "react";
import SimpleMap from "../SimpleMap/SimpleMap";



    

export default function TripPage(){
    const tripData = useParams();
    
    const [tripD, setTripD] = useState(null);
    const [tripPosts, setTripPosts] = useState(null);
    const [destinations, setDestinations] = useState(null);
    const [pendingDests, setPendingDests] = useState(false);

    useEffect(() => {
        const api = `http://192.168.10.151:3000/api/v1/trips/${tripData.id}`
        fetch(api, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (!res.ok){
                console.log("error");
            }
            return res.json();
        }).then((data) => {
            setTripD(data);
            //not neede (yet)
            //getTripPosts(tripData.id, setTripPosts);
            setPendingDests(true)
            getDestinations(tripData.id, setDestinations, setPendingDests);
        }).catch((err) => {
            console.error(err);
        });
    }, [tripData.id])

    return (
        <div style={{width: "100%", padding: "4%", marginBottom: "15%"}}>
            <h1> Trip: </h1>
            {tripD ? (
                <div>
                    <h1>{tripD.name}</h1>
                    <h2>{tripD.description}</h2>
                    {pendingDests ? (
                        <h2>Loading Destinations..</h2>
                    )
                    : (
                        <div >
                            <h2>Destinations Map</h2>
                            <SimpleMap MapProps={destinations}/>
                        </div>

                    )}
                </div>
            ) : (
                <h2>Loading Data..</h2>
            )}
        </div>
    )
}

async function getTripPosts(tripID, tripPosts, setTripPosts){
    const api = `http://192.168.10.151:3000/api/v1/trips/${tripID}/posts`
    fetch(api, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (!res.ok){
            console.log("error");
        }
        return res.json();
    }
    ).then((data) => {
        //set trip posts to tripPosts + data
        setTripPosts(...tripPosts, data)
    }).catch((err) => {
        console.error(err);
    }
    );

}

async function getDestinations(tripID, setDestinations, setPendingDests){
    const api = `http://192.168.10.151:3000/api/v1/trips/${tripID}/destinations`
    fetch(api, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (!res.ok){
            console.log("error");
        }
        return res.json();
    }
    ).then((data) => {
        setDestinations(data);
        setPendingDests(false);
    }).catch((err) => {
        console.error(err);
        setPendingDests(false);
    }
)};