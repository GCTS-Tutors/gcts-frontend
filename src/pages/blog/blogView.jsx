import React, {useState, useEffect} from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {AllPosts, PostsBySubject} from "./posts";
import {HorizontalRule} from "../../components/elements";
import { getPapers } from "../../api";


export const BlogView = () => {
    const [papers, setPapers] = useState([]);
    
    useEffect(() => {
        const retrievePapers = async () => {
            const response = await getPapers();
            setPapers(response);
        }
        retrievePapers();
    }, []);

    return (
        <div className="w-100 min-vh-100 ">
            <div className="w-100 h-100 p-2 my-5 d-flex flex-column justify-content-evenly align-items-center">
                <div className="my-3 p-2 w-fit-content">
                    <p className="display-4">Papers</p>
                    <HorizontalRule ruleStyles="w-100 border-2 hr-purple "/>
                    <p className="lead">Take a look at some of our sample academic papers.</p>
                    
                </div>
                <div className="w-100 mb-5">
                    {papers && <PostFilters papers={papers}/>}
                </div>
            </div>
        </div>

    )
}

export const PostFilters = ({papers}) => {
    return (
        <div className="blog-view p-2">
            <Tabs defaultActiveKey="all-posts" variant="pills"
                  className="w-100 h-100 justify-content-center align-items-center p-3">
                <Tab eventKey="all-posts" title='All Posts' className="w-100">
                    <AllPosts papers={papers}/>
                </Tab>
                <Tab eventKey="posts-by-subject" title="Subjects" className="w-100">
                    <PostsBySubject papers={papers}/>
                </Tab>
            </Tabs>
        </div>
    )
}

