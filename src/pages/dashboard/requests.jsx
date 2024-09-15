import Table from "react-bootstrap/Table";
import React from "react";
import {SampleRequests} from "../../assets/data/sample_requests";
import {OrderForm} from "../orders/order_form";
import {CustomModal} from "../../components/modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {titleCase} from "../../components/text";
import {HorizontalRule} from "../../components/elements";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import { ColorUrgency} from "../../components/text";
export const RequestsTable = (props) => {
    const userRequests = props.requests
    return (
        <div className="w-90 mx-auto">
            <div className="">
                <NewRequestBtn/>
            </div>
            <Table striped hover responsive>
                <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>#</th>
                    <th>Type</th>
                    <th>Level</th>
                    <th>Pages</th>
                    <th>Sources</th>
                    <th>Urgency</th>
                    <th>Deadline</th>

                </tr>
                </thead>
                <tbody>
                {
                    userRequests.map((request) => (
                        <tr>
                            <td><ViewRequest request={request}/></td>
                            <td></td>
                            <td className="fw-semibold text-purple">{request.id}</td>
                            <td className="small">{request.type}</td>
                            <td className="small">{request.level}</td>
                            <td>{request.pages}</td>
                            <td>{request.sources}</td>
                            <td className={"small fw-semibold " + ColorUrgency(request.urgency)}>{request.urgency}</td>
                            <td></td>

                        </tr>
                    ))
                }
                </tbody>
            </Table>
        </div>
    )
}

export const UserRequests = (props) => {
    return (
        <div className="w-100 p-2">
            <RequestsTable requests={props.requests}/>
        </div>
    )
}
UserRequests.defaultProps = {
    requests: SampleRequests
}



export const NewRequestBtn = (props) => {
    const modalData = {
        link_title: 'New Request',
        modal_body: (<OrderForm/>),
    }
    return (
        <div className="">
            <CustomModal data={modalData}/>
        </div>
    )
}

export const ViewRequest = (props) => {

    const modalData = {
        link_title: 'View',
        modal_body: (<RequestDetails data={props.request}/>),
    }
    return (
        <div className="">
            <CustomModal data={modalData}/>
        </div>
    )
}

export const RequestDetails = (props) => {
    const {id, urgency, type, assigned_to, deadline, created_on} = props.data
    return (
        <div className="d-flex flex-column justify-content-evenly">
            <RequestDetailsHeader id={id} request_date={created_on}/>
            <HorizontalRule ruleStyles="w-100 border-2 text-purple"/>
            <div className="w-100 my-3 text-start">
                <Row>
                    <Col>
                        <Row className="w-100 my-1">
                            <Col lg={3} className="text-purple small">Deadline</Col>
                            <Col md={8} className="">12th Sept 2024</Col>
                        </Row>
                        <Row className="w-100 my-1">
                            <Col lg={3} className="text-purple small">Urgency</Col>
                            <Col md={8} className={"fw-semibold " + ColorUrgency(urgency)}>{titleCase(urgency)}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="w-100 my-1">
                            <Col lg={3} className="text-purple small">Assigned</Col>
                            <Col md={8} className="">{assigned_to ? 'Yes' : 'No'}</Col>
                        </Row>
                        <Row className="w-100 my-1">
                            <Col lg={3} className="text-purple small">Solution</Col>
                            <Col md={8}>{titleCase(type)}</Col></Row>
                    </Col>
                </Row>
            </div>
            <HorizontalRule ruleStyles="w-100 border-2 text-purple "/>
            <div className="">
                {
                    FindUserRequestActions(props.user_type)
                }
            </div>

        </div>
    )
}
RequestDetails.defaultProps = {
    user_type: "admin",
}

export const RequestDetailsHeader = (props) => {

    return (
        <div className="d-flex flex-column justify-content-evenly">
            <div className="my-2 d-flex flex-row justify-content-between fs-5 text-purple">
                <span className="text-purple fw-semibold">Request ID</span>
                <span className="text-purple"># {props.id}</span>
            </div>
            <div>
                <span className="text-black-50 small">Created on{props.request_date}</span>
            </div>
        </div>
    )
}

function FindUserRequestActions(user) {
    let userActions
    switch (user.toLowerCase()) {
        case 'admin':
            userActions = (<AdminRequestActions/>);
            break;

        case 'expert':
            userActions = (<ExpertRequestActions/>)
            break;

        default:
            userActions = (<LearnerRequestActions/>);
            break;
    }
    return userActions
}

export const AdminRequestActions = (props) => {
    return (
        <div className="w-100">
            <Form>
                <Form.Group>
                    <Form.Text className="ms-2">Expert Assigned</Form.Text>
                    <Form.Select>
                        <option defaultValue>None</option>
                        {
                            props.allExperts.map((expert) => (
                                <option value={expert.id}>{expert.username}</option>
                            ))
                        }

                    </Form.Select>
                </Form.Group>
            </Form>
            <HorizontalRule ruleStyles="w-100 border-2 text-purple my-4"/>
            <LearnerRequestActions/>
        </div>
    )
}
AdminRequestActions.defaultProps = {
    allExperts: [{}]
}

export const ExpertRequestActions = (props) => {
    return (
        <div className="p-3 w-100">
            <Form className="w-100 d-flex flex-column justify-content-evenly align-items-center">
                <div className="">
                    <p className="fs-5 fw-semibold text-purple">Make Request</p>
                </div>
                <div className="">
                    <p className="">Make a request to be assigned this task.</p>
                </div>
                <div className="w-50 my-1">
                    <Button type="submit" className="small btn btn-danger w-100">Make Request</Button>
                </div>
            </Form>
        </div>
    )
}
export const LearnerRequestActions = (props) => {
    return (
        <div className="p-3 w-100 d-flex flex-column justify-content-evenly align-items-center">
            <div className="">
                <p className="fs-5 fw-semibold text-purple">Cancel Request</p>
            </div>
            <div className="d-flex flex-column justify-content-evenly align-items-center">
                <Link className="btn-danger smaller btn w-100" to="">Cancel</Link>
                <p className="smaller text-black-50 mt-3">* Charges may be incurred.</p>
            </div>
        </div>
    )
}