
import React from "react";
import "./Profile.css";
import { API_URL } from "../../constants";

export default function ProfilePic() {
    const [ profilePic, setProfilePic ] = React.useState(null);
    const [ file, setFile ] = React.useState("");

    React.useEffect(() => {
        getProfilePic({setProfilePic});
    }, [])


    const handleChange = (e) => {
        const newf = e.target.files[0];
        uploadpic({file: newf, setProfilePic});
    }

    const handleClick = () => {
        console.log("clicked");
    }

    return (
        <div className="PPcont">
            {profilePic ? (
                <div>
                    <img className="PPic" src={profilePic} alt="profile pic" />
                </div>
                ) : (
                    <div>
                        <img className="PPic" src={"./default.png"} alt="profile pic" />
                    </div>
                    )
            }
            
            <label className="aa">
                <h4 className="plus">Change avatar</h4>
                <input type="file" id="file" accept="image/*" onChange={handleChange} />
            </label>
        </div>
    )
}


function uploadpic({file, setProfilePic}){
    const formData = new FormData();
    formData.append("profilePic", file);
    const params = {
        email: localStorage.getItem("email")
    }
    const queryString = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const api = `http://${API_URL}:3000/api/v1/update_pic?`+queryString;
    fetch(api, {
        method: "POST",
        headers: {
            Authorization: localStorage.getItem("token"),
        },
        body: formData
    }).then((res) => {
        if (!res.ok){
            console.log("error");
        }
        return res;
    }
    ).then((data) => {
        //File recieved here
        if (data.ok){
            setProfilePic(data.url)
        }
    }
    ).catch((err) => {
        console.error(err);
    }
    );
}

function getProfilePic({setProfilePic}){
    const params = {
        email: localStorage.getItem("email")
    }
    const queryString = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const api = `http://${API_URL}:3000/api/v1/profile_pic?`+queryString;
    fetch(api, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("token"),
        }
    }).then((res) => {
        if (!res.ok){
            console.log("error");
        }
        return res;
    }
    ).then((data) => {
        //File recieved here
        if (data.ok){
            console.log("is ok")
            const img = data.url
            setProfilePic(img)
        }
        
    }
    ).catch((err) => {
        console.error(err);
    }
    );
}