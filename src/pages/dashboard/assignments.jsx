import Table from "react-bootstrap/Table";
import React, { useEffect, useState } from "react";
import { ColorUrgency, titleCase } from "../../components/text";
import { CustomModal } from "../../components/modal";
import { HorizontalRule } from "../../components/elements";
import { Form, Card, Button, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FormatDate, FormatTime, GetTimeDifference } from "../../components/date_time";
import { Comments, Review } from "./orders";
import { getOrders, updateOrder } from "../../api";
import solution_img from "../../assets/icons/solution.png";
import { useAuth } from "../../context/AuthContext";

export const AssignmentsTable = (props) => {
    const [userAssignments, setUserAssignments] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            let orders = await getOrders();
            if (!Array.isArray(orders)) {
                orders = [];  // Ensure it's an array
            }
            setUserAssignments(orders);
        };
        fetchOrders();
    }, []);  // Add empty dependency array to avoid repeated calls

    return (
        <div className="w-90 mx-auto">
            <div className="w-100">
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Topic</th>
                            <th>Status</th>
                            <th>Urgency</th>
                            <th>Deadline</th>
                            <th>Price</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userAssignments.length > 0 ? (
                            userAssignments.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td><ViewAssignmentBtn assignment={assignment} /></td>
                                    <td></td>
                                    <td className="fw-semibold">{assignment.topic}</td>
                                    <td className={"small " + ColorUrgency(assignment.status)}>{titleCase(assignment.status)}</td>
                                    <td className={"small " + ColorUrgency(assignment.urgency)}>{titleCase(assignment.urgency)}</td>
                                    <td className="small">{FormatDate(assignment.deadline)}</td>
                                    <td className="small">{assignment.price ? assignment.price : 'TBD'}</td>
                                    <td className={"small " + ColorUrgency(assignment.payment_status)}>{titleCase(assignment.payment_status)}</td>
                                    <td></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No assignments found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};


export const UserAssignments = (props) => {
    return (
        <div className="w-100 p-2">
            <AssignmentsTable assignments={props.assignments} />
        </div>
    )
}

export const ViewAssignmentBtn = (props) => {

    const modalData = {
        link_title: 'View',
        modal_body: (<AssignmentDetailsCard data={props.assignment} />),
    }
    return (
        <div className="">
            <CustomModal data={modalData} />
        </div>
    )
}

export const AssignmentDetailsCard = (props) => {

    const { id, topic, deadline, revisions, created_at } = props.data;

    return (
        <div className="w-100 p-2 d-flex flex-column justify-content-evenly">
            <div className="p-3 w-100">
                <div className="w-100 d-flex flex-column justify-content-evenly align-items-center">
                    <Row className="text-purple fw-semibold fs-1 mx-auto">Assignment</Row>
                    <Row className="my-3">
                        <div className="d-flex flex-column justify-content-evenly align-items-center">
                            <h5 className="fs-6 text-danger">Deadline</h5>
                            <div className="text-danger small">
                                <p className="fs-6 fw-semibold">{FormatTime(deadline)}</p>
                                <p className="">{<GetTimeDifference futureDate={deadline} />}</p>
                            </div>
                        </div>
                    </Row>
                    <Row className="fw-semibold fs-4 mx-1">
                        {titleCase(topic)}
                    </Row>
                    <Row>
                        <small>{FormatTime(created_at)}</small>
                    </Row>
                    <HorizontalRule ruleStyles="w-100 text-purple border-2 my-2" />
                </div>

                <AssignmentDetails data={props.data} />
            </div>
            <HorizontalRule ruleStyles="w-100 border-2 my-1 text-purple" />
            
            <SolutionForm data={props.data} />

            <HorizontalRule ruleStyles="w-100 border-2 my-1 text-purple" />
            
            <Review order={id} />

            <HorizontalRule ruleStyles="w-100 border-2 my-1 text-purple" />

            <Comments order={id} />
            {/* {FindUserAssignmentActions(props.user_type)} */}
        </div>
    )
}

AssignmentDetailsCard.defaultProps = {
    user_type: "learner"
}

export const AssignmentDetails = (props) => {
    const {
        type,
        level,
        price,
        urgency,
        language,
        min_pages,
        max_pages,
        sources,
        style,
        status,
        instructions,
        payment_status,
        files_link
    } = props.data
    return (
        <div className="w-100">
            <Row className="d-flex flex-column justify-content-evenly align-items-center">
                <Row>
                    <Col>
                        <Row className="">
                            <Row className="my-1">
                                <Col lg={5} className="text-purple smaller">Type</Col>
                                <Col md={6} className="small">{titleCase(type)}</Col></Row>
                            <Row className="w-100 my-1 ">
                                <Col lg={5} className="text-purple smaller">Level</Col>
                                <Col md={6} className="small">{titleCase(level)}</Col></Row>
                            <Row className="w-100 my-1">
                                <Col lg={5} className="text-purple smaller">Urgency</Col>
                                <Col md={6} className={"small " + ColorUrgency(urgency)}>{titleCase(urgency)}</Col>
                            </Row>
                            <Row className="w-100 my-1">
                                <Col lg={5} className="text-purple smaller">Price</Col>
                                <Col md={6} className={"small "}>$ {price ? price : 'TBD'}</Col>
                            </Row>
                            <Row className="w-100 my-1">
                                <Col lg={5} className="text-purple smaller">Payment</Col>
                                <Col md={6}
                                    className={"small " + ColorUrgency(payment_status)}>{titleCase(payment_status)}</Col>
                            </Row>
                        </Row>
                    </Col>
                    <Col>
                        <Row className="">
                            <Row className="w-100 my-1">
                                <Col md={5} className="text-purple smaller">Language</Col>
                                <Col md={5} className="small">{titleCase(language)}</Col>
                            </Row>
                            <Row className="w-100 my-1 ">
                                <Col md={5} className="text-purple smaller">Sources</Col>
                                <Col md={5} className="small">{sources}</Col>
                            </Row>
                            <Row className="w-100 my-1">
                                <Col md={5} className="text-purple smaller">Style</Col>
                                <Col md={5} className="smaller ">{style.toUpperCase()}</Col>
                            </Row>
                            <Row className="w-100 my-1">
                                <Col md={5} className="text-purple smaller">Status</Col>
                                <Col md={7} className={"small " + ColorUrgency(status)}>{titleCase(status)}</Col>
                            </Row>
                            <Row className="w-100 my-1 ">
                                <Col md={5} className="text-purple smaller">Pages</Col>
                                <Col md={5} className="text-purple ">

                                    <Col md={5}
                                        className="small d-flex flex-row justify-content-start align-items-center">
                                        <div
                                            className="me-2 d-flex flex-column justify-content-evenly align-items-start">
                                            <Col md={4} className="text-purple smaller">Min</Col>
                                            <Col md={7} className="small">{min_pages}</Col>
                                        </div>
                                        <div
                                            className="ms-2 d-flex flex-column justify-content-evenly align-items-start">
                                            <Col md={4} className="text-purple smaller">Max</Col>
                                            <Col md={7} className="small">{max_pages}</Col>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <div className="mx-1 mt-3 p-2">
                        <Row className="text-purple small">Instructions</Row>
                        <Row className="mt-1">{instructions}</Row>
                    </div>
                    <div className="mx-1 mt-3 p-2">
                        <Row className="text-purple small">Files</Row>
                        <Row className="mt-1">{files_link ? <a href={files_link} target="_blank" rel="noreferrer" className="site-btn rounded p-2" style={{ width: "fit-content" }}>View Files</a> : "No Files"}</Row>
                    </div>
                </Row>
            </Row>
        </div>
    )
}

export const AssignmentRevisions = (props) => {
    const { totalRevisions } = props.data;

    // Placeholder for 3 solutions
    const solutions = [1, 2, 3];

    return (
        <div className="p-3">
            <h5 className="text-purple">Solutions</h5>
            <Row className="d-flex justify-content-center">
                {solutions.map((_, idx) => (
                    <Col md={4} key={idx}>
                        <RevisionCard
                            data={{
                                id: idx + 1,
                                download_link: idx < totalRevisions ? "https://mediafire.com/solution" : null,
                                upload_link: idx === 0 ? "https://file.io/upload" : null,
                                feedback_link: "https://request-revision-link",
                            }}
                            isStudent={props.userType === "learner"}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

AssignmentRevisions.defaultProps = {
    data: {
        totalRevisions: 3,
    },
}


export const RevisionCard = (props) => {
    const { download_link, upload_link, feedback_link } = props.data;
    const isAvailable = !!download_link;

    return (
        <Card
            className={`my-3 text-center ${!isAvailable ? 'bg-light text-muted' : ''}`}
            style={{ opacity: isAvailable ? 1 : 0.6 }}
        >
            <Card.Header className="text-center">
                <Image src={solution_img} className="guide-card-img" fluid /><br></br>
                Solution {props.data.id}

            </Card.Header>
            <Card.Body>


                {isAvailable ? (

                    <Card.Text>
                        {props.isStudent ? (
                            <>
                                <Link to={download_link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="primary" size="sm">Download</Button>
                                </Link>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="mx-2"
                                    onClick={() => window.confirm("Request a revision?")}
                                >
                                    Request Revision
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to={download_link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="primary" size="sm">Download</Button>
                                </Link>
                                <Link to={upload_link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="secondary" size="sm" className="mx-2">Upload Solution</Button>
                                </Link>
                            </>
                        )}
                    </Card.Text>

                ) : (
                    <Card.Text>
                        Solution not available.
                    </Card.Text>
                )}
            </Card.Body>
        </Card>
    );
};

RevisionCard.defaultProps = {
    data: {
        download_link: null,
        upload_link: null,
        feedback_link: null,
    },
    isStudent: true,
};

export const RevisionDetails = (props) => {
    const { revision_id, download_link, upload_link, feedback_link } = props.data

    return (

        <div className="w-fit-content mx-1 d-flex flex-column justify-content-evenly align-items-center">
            <div className="">
                <div>
                    <p className="fw-semibold">{revision_id}</p>
                </div>
                <RevisionActions data={{ upload_link, download_link, feedback_link }} />
            </div>
        </div>
    )
}


RevisionDetails.defaultProps = {
    data: {
        revision_id: 0,
        download_link: "localhost:8000",
        upload_link: "localhost:8000",
        feedback_link: "localhost:8000",
    },
}


export const RevisionActions = (props) => {
    let isExpert
    const userType = props.user_type
    isExpert = userType.toLowerCase() === 'expert' ? (<ExpertRevisionsActions />) : (<></>)
    const { download_link, feedback_link } = props.data
    return (
        <div className="d-flex flex-column justify-content-evenly align-items-center">
            <Col className="smaller me-1"><Link to={download_link} className="link-purple">Download</Link></Col>
            <Col className="smaller me-1"><Link to={feedback_link} className="link-purple">Feedback</Link></Col>
            {isExpert}
        </div>
    )
}

RevisionActions.defaultProps = {
    data: {
        download_link: "localhost:8000",
        feedback_link: "localhost:8000",
    },
    user_type: "expert",
}

export const ExpertRevisionsActions = (props) => {
    const { upload_link } = props.data
    return (
        <div className="d-flex flex-column justify-content-evenly align-items-center">
            <Col className="smaller me-1"><Link to={upload_link} className="link-purple">Upload</Link></Col>
        </div>
    )
}

ExpertRevisionsActions.defaultProps = {
    data: {
        upload_link: "localhost:8000",
    },
}

export const SourcesDetails = (props) => {
    const { sources } = props.data
    return (
        <div className="w-100 d-flex flex-column justify-content-evenly align-items-center">
            <div>
                <p className="fs-5 fw-semibold text-purple">Sources</p>
            </div>
            <div className="">
                <p className="fw-semibold fs-3">{sources}</p>
            </div>
            <SourcesActions data={{}} />
        </div>
    )
}

export const SourcesActions = (props) => {

    const { upload_link } = props.data
    return (
        <div className="d-flex flex-column justify-content-evenly">
            <Col className="small me-1"><Link to={upload_link} className="link-purple small">Add</Link></Col>

        </div>
    )
}
SourcesActions.defaultProps = {
    data: {
        upload_link: "localhost:8000",
    }
}

const CancelAssignment = (props) => {
    return (
        <div className="p-3 w-100 d-flex flex-column justify-content-evenly align-items-center">
            <div className="">
                <p className="fs-5 fw-semibold text-purple">Cancel Assignment</p>
            </div>
            <div className="d-flex flex-column justify-content-evenly align-items-center">
                <p className="small text-center">Type in the text below to cancel this assignment request.</p>
                <Link className="btn-danger smaller btn w-100" to="">Cancel</Link>
                <p className="smaller text-black-50 mt-3">* Charges may be incurred.</p>
            </div>
        </div>
    )
}

function FindUserAssignmentActions(user) {
    let userActions
    const rule = <HorizontalRule ruleStyles="w-100 border-2 my-1 text-purple" />
    switch (user.toLowerCase()) {
        case 'admin':
            userActions = (<CancelAssignment />);
            break;

        case 'expert':
            userActions = (<p>Upload Solution</p>)
            break;

        default:
            userActions = (<CancelAssignment />);
            break;
    }
    return (
        <div className="w-100">
            {rule}
            {userActions}
        </div>

    )
}


export const SolutionForm = (props) => {
    const { user } = useAuth();
    
    const { id, solution_link } = props.data;
    const [solutionLink, setSolutionLink] = useState(solution_link);
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (solutionLink) {
            await updateOrder(id, { solution_link: solutionLink });
            setValidated(true);

        } else {
            setValidated(false);
        }
    };

    return (

        <div className="p-3 text-center">
            <h5 className="text-purple">Solution</h5>
            { user?.role != "student" &&
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                    <div className="input-group">
                        {/* Input for the solution link */}
                        <Form.Control
                            type="text"
                            placeholder="Upload solution and upload link here. -> https://file.io/solution_link"
                            value={solutionLink}
                            required
                            onChange={(e) => setSolutionLink(e.target.value)}
                            isInvalid={!solutionLink && validated}
                        />

                        {/* Submit Button */}
                        <Button type="submit" variant="dark">
                            Upload
                        </Button>
                    </div>

                    {/* Validation Feedback */}
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid solution link.
                    </Form.Control.Feedback>


                </Form.Group>
            </Form>
            }
            {/* Conditionally render the 'View Solution' button */}
            {solutionLink ? (
                <div className="mt-3 text-center">
                    <Button
                        href={solutionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="dark"
                    >
                        View Solution
                    </Button>
                </div>
            ) : (
                <p>No solution yet!</p>
            )}
        </div>

    );
};
