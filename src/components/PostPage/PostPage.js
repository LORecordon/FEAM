import React from "react";
import { useParams } from "react-router-dom";
import {API_URL} from "../../constants";
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import "./PostPage.css";

export default function PostPage(){
    const postId = useParams();
    const [post, setPost] = React.useState(null);

    React.useEffect(() => {
        getPost(postId.id, setPost);
    }
    , []);

    return (
        <div className="pp-page">
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
        console.log("POST")
        console.log(data);
        setPost(data);
    }).catch((err) => {
        console.error(err);
    });
}

function PostImages({postId}){
    const [images, setImages] = React.useState(null);
    const [selectedImage, setSelectedImage] = React.useState(null);
    React.useEffect(() => {
        getImages(postId, setImages);
    }
    , []);

    const handleimgclick = (image) => {
        setSelectedImage(image.target.src);
    }

    return (
        <div>
            {images ? (
                <div className="images-container">
                    {images.map((image, idx) => (
                        //<Image key={idx} image={image}/>
                        <img className="img" src={image} alt="Post Image" onClick={(img) => handleimgclick(img)} />
                    ))}
                    <label className="input-photo">
                        <h1 className="plus">+</h1>
                        <input type="file" onChange={(e) => addimg(e.target.files[0], postId, images, setImages)} />   
                    </label>
                </div>
            ) : (
                <SpinnerOfDoom />
            )
            }
            {selectedImage ? (
                <div className="si-container">
                    <button className="close-button" onClick={() => setSelectedImage(null)}>X</button>
                    <img className="selected-img" src={selectedImage} alt="Post Image" />
                </div>
            ) : (
                <h1></h1>
            )
            }
        </div>
    )
}

const Image = ({image}) => {
    return (
        <img className="img" src={image} alt="Post Image" />
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
        console.log("Images");
        console.log(data)
        setImages(data);
    }).catch((err) => {
        console.error(err);
    });
}

async function addimg(file, postId, images, setImages){
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
            //add image to existing images
            const newImages = getImages(postId, setImages);
        }
    }
    ).catch((err) => {
        console.error(err);
    }
    );
}