import React from "react";
import {LearnerNav} from "./learner";
import {HorizontalRule} from "../../components/elements";
import {TutorNav} from "./tutor";
import {AdminNav} from "./admin";
import {SampleAssignments} from "../../assets/data/sample_assignments";
import {SamplePayments} from "../../assets/data/payments";
import {SampleUsers} from "../../assets/data/users";
import {SampleRequests} from "../../assets/data/sample_requests";
import {useAuth} from "../../context/AuthContext";
import { NewRequestBtn } from "./requests";

export const Dashboard = (props) => {
    const {user} = useAuth();
    return (
        <div className="w-100 min-vh-100 d-flex flex-column justify-content-start align-items-center">
            <div className="h-fit-content">
                <div className="w-100 mt-5">
                    <h1 className="lead fs-1">{user.username}'s Dashboard</h1>
                </div>
                <HorizontalRule ruleStyles={"w-40 border-3 border-purple my-2"}/>
                <div className="">
                    {/* <Link to="/settings" className="small link-purple">Settings</Link> */}
                    <NewRequestBtn />
                </div>
            </div>
            <div className="w-100 h-auto d-flex flex-column justify-content-evenly align-items-center">
                <div className="w-100 h-100 my-5">
                    <DashboardNav />
                </div>
            </div>
        </div>
    )
}


export const DashboardNav = (props) => {
    const {userData} = props.data
    const {user} = useAuth()
    const userType = user.role
    let navType
    switch (userType) {
        case 'student':
            navType = (<LearnerNav data={userData}/>);
            break;

        case 'writer':
            navType = (<TutorNav data={userData}/>);
            break;

        case 'admin':
            navType = (<AdminNav data={userData}/>);
            break;

        default:
            navType = (<LearnerNav data={userData}/>);
            break;
    }

    return (

        <div className="scroll-pills w-100 h-100">
            {navType}
        </div>
    )
}

DashboardNav.defaultProps = {
    data: {
        userType: '',
        userData: {
            assignments: SampleAssignments,
            payments: SamplePayments,
            requests: SampleRequests,
            users: SampleUsers,
        }
    }
}

