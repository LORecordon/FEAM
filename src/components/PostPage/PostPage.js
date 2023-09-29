import React from "react";
import { useParams } from "react-router-dom";
import {API_URL} from "../../constants";
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";

export default function PostPage(){
    const postId = useParams();
    const [post, setPost] = React.useState(null);

    React.useEffect(() => {
        getPost(postId.id, setPost);
    }
    , []);

    return (
        <div>
            {post ? (
                <div>
                    <h1>{post.title}</h1>
                    <h6>{post.created_at}</h6>
                    <h2>{post.body}</h2>
                    <PostImages postId={postId.id} />
                </div>
            ) : (
                <SpinnerOfDoom />
            )
            }
        </div>
    )
}

async function getPost(postId, setPost){
    const api = `http://${API_URL}:3000/api/v1/posts/${postId}`
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
        console.log(data);
        setPost(data);
    }).catch((err) => {
        console.error(err);
    });
}

function PostImages({postId}){
    const [images, setImages] = React.useState(null);
    React.useEffect(() => {
        getImages(postId, setImages);
    }
    , []);

    return (
        <div>
            {images ? (
                <div>
                    <h1>We got something</h1>
                </div>
            ) : (
                <SpinnerOfDoom />
            )
            }
        </div>
    )
}

async function getImages(postId, setImages){
    const api = `http://${API_URL}:3000/api/v1/posts/${postId}/images`
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
        console.log(data);
        console.log(data)
        setImages(data);
    }).catch((err) => {
        console.error(err);
    });
}

async function addimg(file, postId){
    const formData = new FormData();
    formData.append("image", file);
    const api = `http://${API_URL}:3000/api/v1/posts/${postId}/addimg`
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
            console.log("ok")
        }
    }
    ).catch((err) => {
        console.error(err);
    }
    );
}