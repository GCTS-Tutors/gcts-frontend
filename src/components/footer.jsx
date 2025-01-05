import React, { useState } from "react";
import { Modal, Form, Button, Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SiteData } from "../assets/data/site";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import OTPForm from "./OTPForm";
import { createInquiry, generateOTP, verifyOTP } from "../api";
import { CustomModal } from "./modal";
import { LoadingSuccessError } from "./loadingSuccessError";


export const CustomFooter = () => {
    return (
        <div className="w-100 bg-purple text-white">
            <div className="w-100 p-2 footer bg-purple text-white py-4">
                <Row className="w-100 text-center justify-content-center align-items-center">
                    <Col xs={12} md={4} className="mb-3">
                        <FooterContactInfo />
                    </Col>
                    <Col xs={12} md={4} className="mb-3">
                        <ContactUs />
                    </Col>
                    <Col xs={12} md={4} className="mb-3">
                        <FooterLinks />
                    </Col>
                </Row>

            </div>
            <div className="py-2 border-top border-dark bg-black">
                <span className="text-center small text-white">Copyright &copy; {SiteData.site_name} {new Date().getFullYear()}</span>
            </div>
        </div>
    );
};

export const FooterContactInfo = () => {
    return (
        <div>
            <Image src={SiteData.logo} fluid width={"100px"} className="my-2 py-2" alt="GCTS Logo" />
            <h2 className="fs-1 fw-bold">{SiteData.site_abbrev}</h2>
            <div className="social-icons d-flex justify-content-center">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                    <FaFacebook size={24} />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                    <FaTwitter size={24} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                    <FaInstagram size={24} />
                </a>
            </div>
        </div>
    );
};

export const ContactUs = () => {
    const [otpRequested, setOtpRequested] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [modalState, setModalState] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [resetTime, setResetTime] = useState(5000);
    const [validated, setValidated] = useState(false);

    const resetStates = () => {
        setTimeout(() => {
            setOtpRequested(false);
            setEmail("");
            setMessage("");
            setModalState(null);
            setModalMessage("");
            setResetTime(5000);
            setValidated(false);
        }, resetTime);
    };

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setOtpRequested(true);
        setModalState("loading");
        setModalMessage(<LoadingSuccessError message="Sending OTP..." icon="loading" color="purple" />);

        try {
            // Simulate OTP request
            await generateOTP(email);
            setModalState("otp");
            setResetTime(600000);
        } catch (error) {
            setModalState("error");
            setModalMessage(<LoadingSuccessError message="Error sending email. Please try again." icon="error" color="red" />);
            resetStates();
        }
    };

    const handleOtpVerification = async (otp) => {
        setModalState("loading");
        setModalMessage(<LoadingSuccessError message="Verifying OTP..." icon="loading" color="purple" />);

        try {
            await verifyOTP(email, otp);
            await createInquiry({ email, message });
            setModalState("success");
            setModalMessage(<LoadingSuccessError message="Thank you for contacting us. We'll get back to you soon." icon="success" color="green" />);
            setResetTime(5000);
        } catch (error) {
            setModalState("error");
            setModalMessage(<LoadingSuccessError message="Error verifying OTP. Please try again." icon="error" color="red" />);
            setResetTime(5000);
        } finally {
            resetStates();
        }
    };

    return (
        <div>
            <Form className="contact-us-form" id="footer" noValidate validated={validated} onSubmit={handleSubmit}>
                <h2>Contact Us</h2>
                <small className="text-muted d-block mb-3">Got a question? Need direct help?</small>

                {/* Message Field */}
                <Form.Group controlId="formMessage" className="mb-3">
                    <Form.Control
                        as="textarea"
                        placeholder="This is my message..."
                        rows={5}
                        value={message}
                        required
                        onChange={(e) => setMessage(e.target.value)}
                        isInvalid={!message && validated}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a message.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Email Field */}
                <Form.Group controlId="formEmail" className="mb-3">
                    <div className="input-group">
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!email && validated}
                        />
                        {/* Submit Button */}
                        <Button type="submit" variant="dark">
                            Send
                        </Button>
                    </div>

                    <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                    </Form.Control.Feedback>
                </Form.Group>


            </Form>

            {/* OTP Modal */}
            {otpRequested && (
                <Modal show={otpRequested} onHide={() => setOtpRequested(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>OTP Email Verification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalState === "otp" ? (
                            <OTPForm onSubmit={handleOtpVerification} />
                        ) : (
                            modalMessage
                        )}
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export const FooterLinks = () => {
    return (
        <ul className="list-unstyled">
            <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">
                    Home
                </Link>
            </li>
            <li className="mb-2">
                <Link to="/papers" className="text-white text-decoration-none">
                    Papers
                </Link>
            </li>
            {/* <li className="mb-2">
                <Link to="/papers" className="text-white text-decoration-none">
                    Papers
                </Link>
            </li>
            <li className="mb-2">
                <Link to="/faqs" className="text-white text-decoration-none">
                    FAQs
                </Link>
            </li>
            <li>
                <Link to="/settings" className="text-white text-decoration-none">
                    Settings
                </Link>
            </li> */}
        </ul>
    );
};
