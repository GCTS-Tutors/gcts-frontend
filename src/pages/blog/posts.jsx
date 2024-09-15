import React from "react";
import {BlogPost} from "./blog";
import {SamplePosts} from "../../assets/data/sample_posts";
import {Subjects} from "../../assets/data/subjects";
import defaultSubjectIcon from "../../assets/icons/subject_default.png";
import Image from "react-bootstrap/Image";


export const totalPosts = SamplePosts.length
export const AllPosts = (props) => {

    return (
        <div className="all-posts-section w-100 h-100 p-2 d-flex flex-wrap justify-content-evenly align-items-center">

            {
                SamplePosts.map((post) => (
                    <div className="m-2 blog-post-2">
                        <BlogPost data={post}/>
                    </div>
                ))
            }
        </div>
    )
}

export const AllSubjects = () => {
    let subjectList = Subjects.map((subject) => (subject.title))
    let uniqueSubjectSet = new Set(subjectList)
    let uniqueSubjectArray;
    uniqueSubjectArray = Array.from(uniqueSubjectSet);
    return uniqueSubjectArray
}
export const SubjectTabs = () => {

    return (
        <div
            className="subject-tabs mx-auto w-100 p-5 d-flex flex-row justify-content-evenly align-items-center overflow-x-scroll">
            {
                Subjects.map((subject) => (
                    <div className="w-25 h-100">
                        <SubjectIcon data={subject}/>
                    </div>
                ))
            }

        </div>
    )
}
export const PostsBySubject = () => {
    return (
        <div className="w-100 h-100 d-flex flex-column justify-content-evenly align-items-center">
            <div className="w-100">
                <p className="lead">Browse our sample papers by subject.</p>
            </div>
            <div className="w-90 px-3">
                <SubjectTabs/>
            </div>
        </div>
    )
}

export const SubjectIcon = (props) => {
    const {title, icon} = props.data
    return (
        <div className="mx-2 p-2 w-100 h-100 subject-tab d-flex flex-column justify-content-evenly align-items-center">
            <div className="w-100 h-60 p-1">
                <Image src={icon} fluid className="w-100 h-100"/>
            </div>
            <div className="w-100 text-center h-30 p-2">
                <h1 className="rem-09 w-100 ">{title}</h1>
            </div>
        </div>
    )
}
SubjectIcon.defaultProps = {
    data: {
        title: "Subject",
        icon: defaultSubjectIcon,
    }
}


export const PostPage = () => {
    return (
        <div className="">

        </div>
    )
}

