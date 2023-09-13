import React from "react";
import SimpleMap from "../SimpleMap/SimpleMap";
import { TextField, Button } from "@mui/material";
import { useState } from "react";



export default function TripsNew(){
    const [tags, setTags] = useState([])
    const [tagging, setTagging] = useState("")

    const handleAddTag = () => {
        setTags([...tags, tagging])
        setTagging("")
    }

    const handleTagging = (event) => {
        setTagging(event.target.value)
    }

    return (
        <div className="new-trip-form">
            <h1>Create you Trip!</h1>
            <TextField
              style={{ width: "30%", margin: "5px" }}
              type="text"
              label="Trip Title"
              variant="outlined"
            />
            <br />
            <TextField
              style={{ width: "100%", margin: "5px"}}
              type="text"
              label="Tell us more about your trip..."
              variant="outlined"
            />
            <div className="addpeople">
                <TextField
                  style={{ width: "50%", margin: "5px"}}
                  type="text"
                  label="Tag your trip partners"
                  variant="outlined"
                  value={tagging}
                  onChange={handleTagging}
                />
                <Button variant="contained" color="primary" onClick={handleAddTag}>
                  Add
                </Button>
            </div>
            <div className="taglist">
                {tags.map(tag => {return <h3 className="tags">@{tag}</h3>})}
            </div>
            <br />
            <h3>Where are you going?</h3>
            <SimpleMap />
            <Button variant="contained" color="primary" style={{width: "80px"}}>
              Post!
            </Button>
        </div>
    )
}