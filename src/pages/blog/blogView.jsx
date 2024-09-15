import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {AllPosts, PostsBySubject} from "./posts";
import {CustomNavbar} from "../../components/navbar";
import {CustomFooter} from "../../components/footer";
import {HorizontalRule} from "../../components/elements";

export const BlogView = () => {
    return (
        <div className="w-100 min-vh-100 ">
            <div className="w-100 h-100 p-2 my-5 d-flex flex-column justify-content-evenly align-items-center">
                <div className="my-3 p-2 w-fit-content">
                    <p className="display-4">Blog</p>
                    <HorizontalRule ruleStyles="w-100 border-2 hr-purple "/>
                    <p className="lead">Take a look at some of our sample academic papers.</p>
                </div>
                <div className="w-100 mb-5">
                    <PostFilters/>
                </div>
            </div>
        </div>

    )
}

export const PostFilters = () => {
    return (
        <div className="blog-view p-2">
            <Tabs defaultActiveKey="all-posts" variant="pills"
                  className="w-100 h-100 justify-content-center align-items-center p-3">
                <Tab eventKey="all-posts" title='All Posts' className="w-100">
                    <AllPosts/>
                </Tab>
                <Tab eventKey="posts-by-subject" title="Subjects" className="w-100">
                    <PostsBySubject/>
                </Tab>
            </Tabs>
        </div>
    )
}

