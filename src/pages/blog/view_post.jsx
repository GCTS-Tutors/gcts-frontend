import React from "react";
import {useParams} from "react-router-dom";
import {SamplePosts} from "../../assets/data/sample_posts";
import {CountPostWords} from "./blog";

export const ViewPost = (props) => {
    const {title} = useParams()
    const viewPost = SamplePosts.find((post) => post.title === title)
    const word_count = CountPostWords(viewPost.text)

    return (
        <div className="w-100 h-100">
            <div className="blog-content w-100 h-100 my-5 p-3 d-flex flex-wrap justify-content-around align-items-center">

                <div className="w-100 h-100 p-2 d-flex flex-column justify-content-around align-items-center">
                    <div className="mb-5">
                        <h1 className="border-bottom border-3 pb-2 text-purple">{viewPost.title}</h1>
                        <p className="lead">{viewPost.description}</p>
                        <div className="my-1 small">
                            <span className="text-purple">Date posted: </span>
                            <span className="">Thursday 23rd April 2023</span>
                        </div>
                    </div>

                    <div className="post-page w-100 h-100 line p-5 box-shadow-2 d-flex-column justify-content-end">
                        <p className="post-text w-100 h-100 text m-auto z-0">{viewPost.text}</p>
                        <div className="limited-view w-100 h-50 p-5 z-1 bg-purple"></div>
                    </div>

                </div>

            </div>

        </div>

    )
}

export const PostPage = (props) => {
    const {text} = props.data
    return (
        <div className="blog-pages p-2 box-shadow-2 w-75 h-40 m-3">
            {text}
        </div>
    )
}
PostPage.defaultProps = {
    data: {
        text: "Nothing to show",

    }
}
