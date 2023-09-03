import { Button } from "@mui/material"
import LogIn from "./LogIn"
import { useNavigate } from "react-router-dom"



//no se usa



export default function Profile(){
    const navigate = useNavigate()

    const signOut = () => {
        localStorage.setItem("token", "")
        navigate("/")
    }

    try{
        if (localStorage.getItem("token").length !== 0){
            return (
                <div>
                    <h1>You Are Signed In</h1>
                    <Button size="large" variant="contained" onClick={signOut}>SignOut</Button>
                </div>
            )
        } else {
            return (
                <LogIn />
            )
        }
    } catch (err) {
        console.log(err)
        return (
            <LogIn />
        )
    }
}