import { useLocation, useParams } from "react-router-dom";
import React, {useEffect} from "react";
import "./FTH.css";
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { API_URL } from "../../constants";

export default function FriendshipTokenHandler() {
    const [friendshipToken, setFriendshipToken] = React.useState(null);
    const [friend, setFriend] = React.useState(null);
    const [message, setMessage] = React.useState(null); //error message
    const [display, setDisplay] = React.useState(false);
    const [buttonVal, setButtonVal] = React.useState("Cancel");
    const location = useLocation();
    const [lat, setLat] = React.useState(null);

    function success(pos) {
        const latlng = pos.coords.latitude + "," + pos.coords.longitude;
        setLat(latlng);
    }
    function error(err) {
        setLat({lat: 0, lng: 0});
    }
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const friendshipToken = queryParams.get('friendshipToken');
        if (friendshipToken) {
            if (!lat){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(success, error);
                } else {
                    console.log('Geolocation Not Supported')
                }
            }
            else{
                console.log(lat)
                setFriendshipToken(friendshipToken);
                setDisplay(true);
                getFriend(friendshipToken, lat, setFriend, setButtonVal, setMessage);
            }
        }
        
    }, [lat]);

    const handleClick = () => {
        setDisplay(false);
    }

    if (friendshipToken && localStorage.getItem("token") && display) {
        return (
            <div className="ft-container">
                <h1 className="AF-title">Adding Friend</h1>
                <h3 className="AF-subtitle"> Please wait </h3>
                {friend ? (
                    <div>
                        <h3 className="friendbox">{friend}</h3>
                        <h3>{message}</h3>
                    </div>
                ) : (
                    <h1>
                        <SpinnerOfDoom color={'primary.main'} />
                    </h1>
                )}
                <input className="closebutton" type="button" value={buttonVal} onClick={handleClick}/>

            </div>
        )
    }
}

async function getFriend(friendshipToken, lat, setFriend, setButtonVal, setMessage){
    const api = new URL(`http://${API_URL}:3000/api/v1/friendships`);
    //api.searchParams.append("ftoken", friendshipToken);
    //api.searchParams.append("email", localStorage.getItem("email"));
    //api.searchParams.append("lat", lat);
    try{
        const res = await fetch(api, {
            method: "POST",
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ftoken: friendshipToken,
                email: localStorage.getItem("email"),
                lat: lat
            })
        });
        if (!res.ok){
            console.log("error");
        }
        const data = await res.json();
        console.log(data)
        if (data.errors){
            setFriend(data.friend.email)
            setMessage(data.errors);
        }
        else{
            setFriend(data.friend.email);
            setMessage("Friend added successfully!");
        }
        setButtonVal("Done")
    }
    catch(err){
        console.log(err);
    }

}