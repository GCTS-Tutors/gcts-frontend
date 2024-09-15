import {Image} from "react-bootstrap";
import {Contacts, SiteData} from "../assets/data/site";
import React from "react";

export const DocHeader = (props) => {

    return (
        <div className="w-100 d-flex flex-row justify-content-between align-content-center">
            <div className="d-flex flex-row justify-content-start align-items-center">
                <Image src={SiteData.logo_purple} fluid width={'40px'} className='mx-1'/>
                <span className="fs-3 mx-1 text-purple">{SiteData.site_abbrev}</span>
            </div>
            <div className="text-center h-fit-content my-auto fs-5 fw-semibold"><span className="text-purple">#</span> {props.idCode}</div>
        </div>
    )
}

export const DocFooter = () => {
    return (
        <div className="w-100 small d-flex flex-wrap justify-content-evenly align-content-center">
            <span className="small">For any enquiries email at </span>
            <span className="text-black-50 small">{Contacts.email}</span>
        </div>
    )
}