import React from "react";
import {Image} from "react-bootstrap";
import {SiteData} from "../assets/data/site";

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export const HorizontalRule = (props) => {
    return (
        <hr className={'mx-auto ' + props.ruleStyles}/>
    )
}

export const SiteLogoBlack = (props) => {
    return (
        <div className="">
            <Image src={SiteData.logo} fluid width={props.width} className='mx-1'/>
        </div>
    )
}
export const SiteLogoPurple = (props) => {
    return (
        <div className="">
            <Image src={SiteData.logo_purple} fluid width={props.width} className='mx-1'/>
        </div>
    )
}
export const SiteLogoAndName = () => {
    return (
        <div className="d-flex flex-row align-items-center">
            <Image src={SiteData.logo} fluid width={'40px'} className='mx-1'/>
            <span className="fs-3 fw-semibold mx-1 text-purple">{SiteData.site_abbrev}</span>
        </div>
    )
}