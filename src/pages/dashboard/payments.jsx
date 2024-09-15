import Table from "react-bootstrap/Table";
import {Image} from "react-bootstrap";
import {Contacts, SiteData} from "../../assets/data/site";
import React from "react";
import {HorizontalRule} from "../../components/elements";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button";
import {Info, Question} from "phosphor-react";
import {DocFooter, DocHeader} from "../../components/documents";
import {titleCase} from "../../components/text";
import {CustomModal} from "../../components/modal";
import { ColorUrgency} from "../../components/text";
import {FormatDate} from "../../components/date_time";
import {CreditCard, PaypalLogo, StripeLogo} from "@phosphor-icons/react";
import {SiPayoneer} from "react-icons/si";

export const PaymentsTable = (props) => {
    const allPayments = props.data

    return (
        <div className="w-90 mx-auto">
            <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>#</th>
                            <th>Amount</th>
                            <th>Transaction</th>
                            <th>Status</th>
                            <th>Method</th>
                            <th>Date Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allPayments.map((payment) => (
                                <tr>
                                    <td><ViewPayment payment={payment}/></td>
                                    <td></td>
                                    <td className="fw-semibold">{payment.id}</td>
                                    <td className="small">{payment.amount}</td>
                                    <td className="small ">{payment.transaction_id}</td>
                                    <td className={"small "}>{payment.payment_status}</td>
                                    <td className="small">
                                        <span className="d-flex flex-row justify-content-center align-items-center">
                                            <span className="me-1">{PaymentPlatformLogo(payment.payment_method)}</span>
                                            <span className="">{payment.payment_method}</span>
                                        </span>
                                    </td>
                                    <td className="smaller">{payment.created_at}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
        </div>
    )
}
export function PaymentPlatformLogo (platform) {
    let platform_icon

    if(platform) {
        switch (platform.toString().toLowerCase()) {
            case 'paypal':
                platform_icon = (<PaypalLogo/>);
                break;
            case 'payoneer':
                platform_icon = (<SiPayoneer/>);
                break;
            case 'stripe':
                platform_icon = (<StripeLogo/>);
                break;
            default:
                platform_icon = (<CreditCard/>);
                break;
        }
    }
    else {
        platform_icon = (<CreditCard/>);
    }
    return platform_icon
}
export const ViewPayment = (props) => {
    const modalData = {
        link_title: 'View',
        modal_body: (<PaymentDetails data={props.payment}/>),
    }
    return (
        <div className="">
            <CustomModal data={modalData}/>
        </div>
    )
}

export const PaymentDetails = (props) => {
    const {id, amount, created_at, transaction_id} = props.data
    const date_paid = FormatDate(created_at)

    return (
        <div
            className="w-100 h-100 d-flex flex-column justify-content-evenly align-items-start">

            <PaymentDetailsHeader id={id} payment_date={date_paid}/>

            <HorizontalRule ruleStyles={"w-100 mx-auto border-3 border-purple"}/>

            <Container className="" fluid="md">
                <Row className="my-3 small">
                    <Col className=" fw-semibold text-purple">Paid on:</Col>
                    <Col className="text-end">{date_paid}</Col>
                </Row>

                <Row className="mt-3 mb-1 small">
                    <Col className=" fw-semibold text-purple">Transaction ID:</Col>
                    <Col className="text-end ">{transaction_id}</Col>
                </Row>
                <Row className="my-2">
                    <Col className=" fw-semibold text-purple small">Amount:</Col>
                    <Col className="text-end"><span className="fw-semibold text-purple">$</span> {amount}</Col>
                </Row>

                <HorizontalRule ruleStyles={"w-90 mx-auto border-1 border-purple"}/>

                <Row className="mt-3 d-flex flex-row justify-content-evenly align-content-center">
                    <div className="d-flex flex-row justify-content-center align-content-center w-fit-content">
                        <div className="">
                            <Button variant="link" className="link-purple site-link">View</Button>
                        </div>
                        <div className="h-fit-content my-auto">
                            <Info size={"20px"} color={SiteData.site_colours.accent_colour}/>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-center align-content-center w-fit-content">
                        <div className="">
                            <Button variant="link" className="link-purple site-link">Help</Button>
                        </div>
                        <div className="h-fit-content my-auto">
                            <Question size={"20px"} color={SiteData.site_colours.accent_colour}/>
                        </div>
                    </div>
                </Row>

                <HorizontalRule ruleStyles="border-purple border-2 w-100 mx-auto "/>

                <Row className="my-1">
                    <DocFooter/>
                </Row>
            </Container>
        </div>
    )
}

export const PaymentDetailsHeader = (props) => {
    return (
        <div className="w-100 d-flex flex-column justify-content-evenly">
            <div className="w-100 my-2 d-flex flex-row justify-content-between fs-5 text-purple">
                <span className="text-purple display-6">Payment </span>
                <span className="text-purple display-6"># {props.id}</span>
            </div>
            <div>
                <span className="text-black-50 small">{props.payment_date}</span>
            </div>
        </div>
    )
}


