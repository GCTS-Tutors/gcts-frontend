import React, { useEffect, useState } from "react";
import { BlogPost } from "./blog";
import { Subjects } from "../../assets/data/subjects";
import defaultSubjectIcon from "../../assets/icons/subject_default.png";
import Image from "react-bootstrap/Image";


export const AllPosts = ({papers}) => {

    return (
        <div className="all-posts-section w-100 h-100 p-2 d-flex flex-wrap justify-content-evenly align-items-center">

            {papers && papers.length > 0 ? ( papers.map((post) => (
                    <div className="m-2 blog-post-2">
                        <BlogPost data={post} />
                    </div>
                ))
            ):(
                <div className="w-100 h-100 d-flex flex-column justify-content-evenly align-items-center">
                    <div className="w-100">
                        <p className="lead">No posts found. Try another subject!</p>
                    </div>
                </div>
            )}
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


export const PostsBySubject = ({papers}) => {
    const allPapers = papers;
    const [subjectPapers, setSubjectPapers] = useState(allPapers); 

    const allSubjects = allPapers.map((paper) => (paper.subject));
    const uniqueSubjects = new Set(allSubjects);
    const uniqueSubjectArray = Array.from(uniqueSubjects);

    const onClickSubject = (subject) => {
        setSubjectPapers(allPapers.filter((post) => post.subject.title === subject));
    }

    return (
        <div className="w-100 h-100 d-flex flex-column justify-content-evenly align-items-center">
            <div className="w-100">
                <p className="lead">Browse our sample papers by subject.</p>
            </div>
            <div className="w-90 px-3">
                <SubjectTabs subjects={uniqueSubjectArray} onClickSubject={onClickSubject}/>
            </div>
            <AllPosts papers={subjectPapers}/>
        </div>
    )
}

export const SubjectTabs = ({subjects, onClickSubject}) => {

    return (
        <div
            className="subject-tabs mx-auto w-100 p-5 d-flex flex-row justify-content-evenly align-items-center overflow-x-scroll">
            {subjects &&
                subjects.map((subject) => (
                    <div className="w-25 h-100">
                        <SubjectIcon title={subject.title} icon={subject.cover_image} onClickSubject={onClickSubject}/>
                    </div>
                ))
            }

        </div>
    )
}

export const SubjectIcon = ({title, icon, onClickSubject}) => {
    return (
        <div className="mx-2 p-2 w-100 h-100 subject-tab d-flex flex-column justify-content-evenly align-items-center" onClick={() => onClickSubject(title)}>
            <div className="w-100 h-60 p-1">
                <Image src={icon} fluid className="w-100 h-100" />
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

