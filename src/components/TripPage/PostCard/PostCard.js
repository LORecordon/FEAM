import React from "react";
import "./PostCard.css";

export default function PostCard(props){
    return (
        <div className="postcontainer">
            <h1>{props.post.title}</h1>
            <h4 className="desc">{props.post.body}</h4>
        </div>
    )
}