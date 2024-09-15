import {Hash} from "phosphor-react";
import {SiteData} from "../../assets/data/site";

export const DashboardStats = () => {
    return (
            <div className="w-100 h-100 d-flex flex-wrap justify-content-evenly align-items-center">
                <div className="m-2">
                    <Stat/>
                </div>
                <div className="m-2">
                    <Stat/>
                </div>
                <div className="m-2">
                    <Stat/>
                </div>
                <div className="m-2">
                    <Stat/>
                </div>

            </div>

    )
}

export const Stat = () => {
    return (
        <div className="stat stat-outline w-100 p-3 rounded-1 border-purple bg-white d-flex flex-column justify-content-center align-items-center">
            <div className="bg-purple p-2 opacity-75 fs-2 w-100 h-40 p-1 d-flex flex-row justify-content-center align-items-center">
                <Hash />
                <span className="">1</span>
            </div>
            <div className="w-100 h-60 p-2 d-flex flex-column justify-content-evenly">
                <span className="fw-semibold text-purple">Winner</span>
                <span className="smaller text-dark-emphasis">Best in things.</span>
            </div>
        </div>
    )
}