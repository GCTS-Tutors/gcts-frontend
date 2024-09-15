import React from "react";
import {Image} from "react-bootstrap";
import defaultBlogPostCover from "../../assets/images/apple-and-books.jpeg";
import {Link} from "react-router-dom";

export const BlogPost = (props) => {
    const { cover_img, title, description } = props.data;

    return (
        <div className="card w-100 h-100 border-0 box-shadow-7 m-2">
            <Link to={'/view-post/' + title} className="w-100 h-100">
                <div className="card-img h-100 w-100">
                    <Image src={cover_img} className="w-100 h-100 object-fit-cover" fluid/>
                </div>
                <div className="card-img-overlay w-100 h-100 p-0">
                    <PostOverlay description={description} title={title}/>
                </div>
            </Link>
        </div>
    )
}
BlogPost.defaultProps = {
    cover_image: defaultBlogPostCover,
}

export const PostOverlay = (props) => {
    return (
        <div className="bg-off-white d-flex flex-column h-100 w-100 flex-column justify-content-end align-content-center">
            <div className="w-100 h-60 mb-1">
                <PostDescription description={props.description}/>
            </div>
            <div className="w-100 h-30 mt-2">
                <PostTitle title={props.title}/>
            </div>
        </div>
    )
}


export const PostTitle = (props) => {
    return (
        <div className="p-2 h-100 w-100 d-flex flex-column justify-content-end">
            <h1 className="text-start fs-4 w-100 h-100">{props.title}</h1>
        </div>
    )
}
PostTitle.defaultProps = {
    title: "Post Title"
}

export const PostDescription = (props) => {
    return (
        <div className="p-2 h-100 d-flex flex-column justify-content-end">
            <span className="text-start">{props.description}</span>
        </div>
    )
}
PostDescription.defaultProps = {
    description: "This is a short description of the post."
}

export function CountPostWords(text) {
    return text.trim().split(/\s+/).length;
}