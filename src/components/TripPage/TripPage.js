import { useParams } from "react-router-dom"
import React, { useEffect, useState } from "react";


async function gettrip(id){
    const heads = {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json"
    };
    try {const res = await fetch(`http://localhost:3000/api/v1/trips/${id}`, {
    method: "GET",
    headers: heads
  })
  const ttt = await res.json()
  return ttt;
  } catch (err) {
      console.log("error")
      console.log(err)
      return false
  }
}

export default function TripPage(){
    const tripData = useParams();
    
    const [tripD, setTripD] = useState(null);

    useEffect(() => {
        const api = `http://localhost:3000/api/v1/trips/${tripData.id}`
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
        }).catch((err) => {
            console.error(err);
        });
    }, [tripData.id])

    return (
        <div>
            <h1> - </h1>
            {tripD ? (
                <div>
                    <h1>{tripD.name}</h1>
                    <h2>{tripD.description}</h2>
                </div>
            ) : (
                <h2>Loading Data..</h2>
            )}
        </div>
    )
}