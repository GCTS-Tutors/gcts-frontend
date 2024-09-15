import React from "react";
import {SiteData} from "../../assets/data/site";
import {Image} from "react-bootstrap";
import {Guidelines} from "../../assets/data/guidelines";

export const GuideSection = (props) => {
    return (
        <div className="w-100 d-flex flex-column justify-content-evenly align-items-center">
            <div className="w-100 p-3 d-flex flex-column justify-content-evenly align-items-center">
                <h1 className="text-purple">Get Started</h1>
                <p className="p-2 w-80 lead">
                    Hello Newbie, welcome to {SiteData.site_name}. Here is a step by step guide to get you started.
                </p>
            </div>
            <div className="mb-3">
                    <a href="#place-order" className="btn site-btn">Place an Order</a>
                </div>
            <div className="guide-section overflow-x-scroll overflow-y-hidden d-flex flex-row justify-content-start justify-content-md-center align-items-center p-2 ">
                {
                    Guidelines.map((guideline) => (
                        <GuideCard key={guideline.id} data={guideline}/>
                    ))
                }
            </div>

        </div>
    )
}

export const GuideCard = (props) => {
    const {id, icon, title, description} = props.data
    return (
        <div className="guide-card card rounded-1 w-30 p-2 border-0 box-shadow-7 m-1 d-flex flex-column justify-content-around align-items-center">
            <div className="h-50 w-100 d-flex flex-column justify-content-between align-items-center p-2">
                <div className="w-100 h-30">
                    <Image src={icon} className="guide-card-img" fluid/>
                </div>
                <div className="w-100 h-20">
                    <h1 className="fs-6">{id}. {title}</h1>
                </div>
            </div>

            <div className="h-40 w-100">
                <span className="small w-100 h-100 p-2">{description}</span>
            </div>
        </div>
    )
}

