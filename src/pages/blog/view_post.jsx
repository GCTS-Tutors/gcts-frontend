import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {SamplePosts} from "../../assets/data/sample_posts";
import {CountPostWords} from "./blog";
import {getPaper, getUserPapers} from "../../api";
import ReactMarkdown from "react-markdown";
import { FormatDate, FormatTime } from "../../components/date_time";
import { get } from "jquery";


export const ViewPost = (props) => {
    const {id} = useParams("id");
    const [viewPost, setViewPost] = useState({});

    useEffect(() => {
        const retrievePost = async () => {
            const response = await getPaper(id);
            setViewPost(response);
        }
        retrievePost();

    }, []);


    return (
        <div className="w-100 h-100">
            <div className="w-100 h-100 my-5 p-3">
    
                <div className="w-80 mx-auto p-2"> {/* Center container horizontally but allow text to align left */}
                    <div className="mb-5">
                        
                        
                        {/* Paragraph content with left alignment */}
                        <div className="row"> {/* Ensure the content is aligned to the left */}

                            <div className="col-12 col-md-6 mx-auto">
                            <h1 className="border-bottom border-3 pb-2 text-purple">{viewPost.title}</h1>
                                <p className="lead text-justify"><ReactMarkdown>{viewPost.content}</ReactMarkdown></p>
                            </div>
                            
                        </div>
                        
                        <div className="my-1 small">
                            <span className="text-purple">Date posted: </span>
                            <span>{FormatDate && FormatDate(viewPost.created_at)}</span>
                        </div>
                    </div>
    
                </div>
    
            </div>
        </div>
    );
    
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
