//simple profile page
import React from 'react';
import { API_URL } from "../../constants";
import QRCard from './QRCard';
import ProfilePic from './ProfilePic';



export default function Profile() {
    const [showQR, setShowQR] = React.useState(false);
    
    const handleClick = () => {
        setShowQR(true);
    }


    return (
        <div>
            <h1>Your Profile</h1>
            <ProfilePic />
            <h2> Email: {localStorage.getItem("email")}</h2>
            {showQR ? ( 
                <QRCard setSHowQR={setShowQR} />
            ) : (
                <input type="button" value="Get QR" onClick={handleClick}/>
                )
            }
        </div>
    );
}

