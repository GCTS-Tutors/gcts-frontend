// /src/components/modal.jsx
import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Spinner } from "react-bootstrap";
import { CheckCircle, XCircle } from "phosphor-react";

export const ModalContent = ({ type, message }) => {
    const getIcon = () => {
        switch (type) {
            case "loading":
                return <Spinner animation="border" variant="primary" />;
            case "success":
                return <CheckCircle size={32} color="green" />;
            case "error":
                return <XCircle size={32} color="red" />;
            default:
                return null;
        }
    };

    return (
        <div className="align-items-center justify-content-center d-flex  p-2">
            <div className="text-center">
                {getIcon()}
                <p>{message}</p>
            </div>
        </div>
    );
};

export const CustomModal = (props) => {
    const { link_title, auto_close_duration, modal_title, modal_body, show_state, modal_size } = props.data
    const [show, setShow] = useState(show_state);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    useEffect(() => {
        if (auto_close_duration && show) {
            const timer = setTimeout(() => {
                handleClose();
            }, auto_close_duration);

            return () => clearTimeout(timer);
            
        }
    }, [auto_close_duration, show]);

    return (
        <>
            {link_title && (
                <Button variant="link" className="site-link link-purple" onClick={handleShow}>
                    <div className="d-flex flex-row justify-content-evenly align-items-center link-purple">
                        <span className="me-2 link-purple small">{link_title}</span>
                        {props.data.link_icon}
                    </div>
                </Button>
            )}

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size={modal_size || 'lg'}
                centered
            >
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title className="w-100 text-center">{modal_title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-5 mx-auto">
                    {modal_body}
                </Modal.Body>
            </Modal>
        </>
    )
}


CustomModal.defaultProps = {
    data: {
        link_title: 'Launch',
        link_style: 'small',
        modal_heading: "Page Title",
        modal_title: 'Action Title',
        modal_body: (<p>No actions available. Try again later.</p>)
    }
}