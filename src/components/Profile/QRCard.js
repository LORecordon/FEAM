import React from "react";
import { API_URL } from "../../constants";
import "./Profile.css"
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";


export default function QRCard({setSHowQR}) {
    const [qrcode, setQrcode] = React.useState(null);

    React.useEffect(() => {
        getqr({setQrcode})
    }, [])

    const handleClick = () => {
        setSHowQR(false);
    }

    return (
        <div className="container">
            <h1 className="cardtitle">Your QR Code</h1>
            {qrcode ? (
                    <div className="codecont">
                        <img src={qrcode} alt="qrcode" className="codeimage" />
                    </div>
            ) : (
                <SpinnerOfDoom color={'primary.main'} />
            )}
            <button className="closebutton" onClick={handleClick}>Done</button>
        </div>
    );
}

function getqr({setQrcode}){
    if ( localStorage.getItem("token") && localStorage.getItem("token").length > 0 ){
        console.log("YEYEYEY")
        //get with email in params
        const params = {
          email: localStorage.getItem("email")
        }
        const queryString = Object.keys(params)
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
          .join('&');
        const api = `http://${API_URL}:3000/api/v1/friendship_token?${queryString}`
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
          console.log(res);
          return res.blob();
        }
        ).then((data) => {
          //File recieved here
          console.log(data);
          const img = new Image();
          img.src = URL.createObjectURL(data);
          img.onload = () => {
            setQrcode(img.src);
          }
          

        }).catch((err) => {
          console.error(err);
        }
        );
    }
}
