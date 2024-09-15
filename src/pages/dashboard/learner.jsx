import Tab from "react-bootstrap/Tab";
import React from "react";
import Tabs from "react-bootstrap/Tabs";
import {PaymentsTable} from "./payments";
import {UserRequests} from "./requests";
import {UserAssignments} from "./assignments";

export const LearnerNav = (props) => {
    const { assignments, requests, payments} = props.data;
    return (
        <Tabs defaultActiveKey="assignments" variant="pills"
              className="dashboard-pills p-2 my-2 mx-auto w-auto h-100 d-flex flex-row justify-content-center align-items-center ">

            <Tab eventKey="assignments" title="Orders">
                <UserAssignments data={assignments}/>
            </Tab>
            {/* <Tab eventKey="requests" title="Requests">
                <UserRequests data={requests}/>
            </Tab>
            <Tab eventKey="payments" title="Payments">
                <PaymentsTable data={payments}/>
            </Tab> */}
        </Tabs>
    )
}






