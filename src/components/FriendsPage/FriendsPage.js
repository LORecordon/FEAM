//Create starter component
import React from 'react';
import { Box } from "@mui/material";
import { API_URL } from '../../constants';
import "./FriendsPage.css";

import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { useEffect } from 'react';

function FriendsPage(props) {
    const [friends, setFriends] = React.useState(null);

    useEffect(() => {
        getFriends({setFriends});
    }, []);
    return (
        <div className='friendpage'>
            <h1> Friends </h1>
            {friends ? (
                <div className='friendcontainer'>
                    {friends.map((friend) => (
                        <FriendBox key={friend.id}
                        name={friend.first_name + " " + friend.last_name} 
                        email={friend.email} />
                    ))}
                </div>
            ) : (
                <SpinnerOfDoom color={'primary.main'} />
            )}
        </div>
    );
}

const FriendBox = (props) => {
    return (
        <div className='friendcomp'>
            <h2>{props.name}</h2>
            <h3>{props.email}</h3>
        </div>
    );
}


async function getFriends({setFriends}) {
    const myurl = new URL(`http://${API_URL}:3000/api/v1/friendships/friends`);
    myurl.searchParams.append("email", localStorage.getItem("email"));
    
    //try to fetch myurl with the authorization token and return the data if successful
    console.log("Trying friends")
    try {
        const response = await fetch(myurl, {
            method: "GET",
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log(data);
        setFriends(data);
    }
    catch (err) {
        console.error(err);
    }
}

export default FriendsPage;