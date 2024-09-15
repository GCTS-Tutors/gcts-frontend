import Tab from "react-bootstrap/Tab";
import React from "react";
import Tabs from "react-bootstrap/Tabs";
import {SampleOrders} from "../../assets/data/orders";
import {AssignmentsTable, UserAssignments} from "./assignments";
import {UserRequests} from "./requests";

export const TutorNav = (props) => {
    const { assignments, orders,requests } = props.data
    return (
        <Tabs defaultActiveKey="dashboard" variant="pills" className="p-2 m-2 h-100 d-flex flex-row justify-content-center align-items-center ">
            <Tab eventKey="requests" title="Requests">
                <UserRequests data={requests}/>
            </Tab>
            {/* <Tab eventKey="orders" title="Orders">
                <UserOrders data={orders}/>
            </Tab> */}
            <Tab eventKey="assignments" title="Assignments">
                <UserAssignments data={assignments}/>
            </Tab>
        </Tabs>
    )
}


export const TutorRequests = () => {
    return (
        <div className="">
            Tutor Requests
        </div>
    )
}

// export const TutorOrders = () => {
//     return (
//         <div className="">
//             <OrdersTable orders={SampleOrders}/>
//         </div>
//     )
// }

export const TutorAssignments = () => {
    return (
        <div className="">
            <AssignmentsTable/>
        </div>
    )
}

export const TutorPayments = () => {
    return (
        <div className="">
            Tutor Payments
        </div>
    )
}

export const TutorSettings = () => {
    return (
        <div className="">
            Tutor Settings
        </div>
    )
}
