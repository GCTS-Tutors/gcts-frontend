import {MaskSad} from "@phosphor-icons/react";

export const ComingSoon = (props) => {
    return (
        <div className="">
            <p>Coming Soon</p>
        </div>
    )
}
export const NotFound = () => {

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="">Nothing was found.</p>
            <MaskSad size={60}/>
        </div>
    )
}