import Tab from "react-bootstrap/Tab";
import React from "react";
import Tabs from "react-bootstrap/Tabs";
import {NewUserBtn, UsersTable} from "./users";
import {UserOrders} from "./orders";
import {UserAssignments} from "./assignments";
import {PaymentsTable} from "./payments";
import {RequestsTable} from "./requests";

export const AdminNav = (props) => {
    const { assignments, payments, requests, users } = props.data
    return (
        <Tabs defaultActiveKey="dashboard" variant="pills" className="p-2 m-2 h-100 d-flex flex-row justify-content-center align-items-center ">
            <Tab eventKey="orders" title="Orders">
                <UserAssignments data={assignments}/>
            </Tab>
            <Tab eventKey="payments" title="Payments">
                <PaymentsTable data={payments}/>
            </Tab>
            <Tab eventKey="requests" title="Requests">
                <RequestsTable requests={requests}/>
            </Tab>
            <Tab eventKey="users" title="Users">
                <NewUserBtn/>
                <UsersTable data={users}/>
            </Tab>
        </Tabs>
    )
}
