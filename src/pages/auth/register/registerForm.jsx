import React, {useEffect, useState} from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {CustomModal} from "../../../components/modal";
import {CheckCircle, XCircle} from "phosphor-react";
import {HorizontalRule} from "../../../components/elements";
import {generateOTP, registerUser, verifyOTP} from "../../../api";
import {useAuth} from "../../../context/AuthContext";
import OTPForm from "../../../components/OTPForm";

export const RegisterForm = () => {
    const {login} = useAuth();
    const timeout = 3000;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [otpModal, setOtpModal] = useState(false);

    // Validation Functions
    const validateUsername = (value) => {
        let errors = [];
        if (!value) {
            errors.push("Username is required.");
        }
        return errors;
    };

    const validateEmail = (value) => {
        let errors = [];
        if (!value) {
            errors.push("Email is required.");
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            errors.push("Invalid email format.");
        }
        return errors;
    };

    const validatePassword = (value) => {
        let errors = [];

        if (!value) {
            errors.push("Password is required.");
        } else {
            if (value.length < 8) {
                errors.push("Password must be at least 8 characters.");
            }
            if (value.length > 20) {
                errors.push("Password must be less than 20 characters.");
            }
            if (!/[a-z]/.test(value)) {
                errors.push("Password must contain at least one lowercase letter.");
            }
            if (!/[A-Z]/.test(value)) {
                errors.push("Password must contain at least one uppercase letter.");
            }
            if (!/[0-9]/.test(value)) {
                errors.push("Password must contain at least one digit.");
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                errors.push("Password must contain at least one special character.");
            }
        }
        return errors;
    };

    const validateConfirmPassword = (passwordValue, confirmPasswordValue) => {
        let errors = [];
        if (passwordValue && confirmPasswordValue && passwordValue !== confirmPasswordValue) {
            errors.push("Passwords do not match.");
        }
        return errors;
    };

    useEffect(() => {
        const currentErrors = {};

        currentErrors.username = validateUsername(formData.username);
        currentErrors.email = validateEmail(formData.email);
        currentErrors.password = validatePassword(formData.password);
        currentErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

        setErrors(currentErrors);
    }, [formData.username, formData.email, formData.password, formData.confirmPassword]);

    const validateForm = () => {
        const currentErrors = {};

        currentErrors.username = validateUsername(formData.username);
        currentErrors.email = validateEmail(formData.email);
        currentErrors.password = validatePassword(formData.password);
        currentErrors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);

        setErrors(currentErrors);

        return Object.values(currentErrors).every((errorArray) => errorArray.length === 0);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleOtpSubmit = async (otp) => {
        // Verify otp
        try {
            await verifyOTP(formData.email, otp);
            setOtpModal(false);
            setLoadingMessage("Verifying OTP...");
            setLoading(true);
            // Call API to register user
            try {
                setLoadingMessage("OTP verified. Creating account...");
                const response = await registerUser(formData.username, formData.email, formData.password);
                await login(formData.username, formData.password);
                setSuccess(true);
                // Redirect to homepage
                setTimeout(() => {
                    navigate('/');
                }, timeout);
            } catch (error) {
                if (error.response.status === 400) {
                    // Check for username already exists
                    if (error.response.data.username) {
                        setErrors({username: error.response.data.username});
                    }
                    if (error.response.data.email) {
                        setErrors({email: error.response.data.email});
                    }
                }
                setError("Registration failed. Please try again.");
            } finally {
                setLoading(false);
                setTimeout(() => {
                    setSuccess(false);
                    setError(null);
                }, timeout);
            }

        } catch (error) {
            // Invalid OTP
            setOtpModal(false);
            setError("Invalid OTP. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoadingMessage("Sending OTP...");
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            // Generate otp first
            await generateOTP(formData.email);
            setOtpModal(true);

        } catch (error) {
            setError("OTP Email verification failed. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccess(false);
                setError(null);
            }, timeout);
        }
    };

    return (
        <div className="d-flex justify-content-evenly align-items-center w-100">
            <div className="w-100">

                <Form onSubmit={handleSubmit} className="w-100 mx-auto">
                    <Form.Group className="my-2 text-start">
                        <Form.Label className="text-purple">Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            isInvalid={errors.username && errors.username.length > 0}
                            autoFocus
                            isValid={formData.username.length > 0 && (!errors.username || errors.username.length === 0)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.username && errors.username.map((error, index) => (
                                <div key={index}><small className="small text-danger">{error}</small></div>
                            ))}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="my-3 text-start">
                        <Form.Label className="text-purple">Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={errors.email && errors.email.length > 0}
                            isValid={formData.email.length > 0 && (!errors.email || errors.email.length === 0)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email && errors.email.map((error, index) => (
                                <div key={index}><small className="small text-danger">{error}</small></div>
                            ))}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="my-3 text-start">
                        <Form.Label className="text-purple">Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={errors.password && errors.password.length > 0}
                            isValid={formData.password.length > 0 && (!errors.password || errors.password.length === 0)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password && errors.password.map((error, index) => (
                                <div key={index}><small className="small text-danger">{error}</small></div>
                            ))}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="my-3 text-start">
                        <Form.Label className="text-purple">Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            isInvalid={errors.confirmPassword && errors.confirmPassword.length > 0}
                            isValid={formData.confirmPassword.length > 0 && (!errors.confirmPassword || errors.confirmPassword.length === 0)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword && errors.confirmPassword.map((error, index) => (
                                <div key={index}><small className="small text-danger">{error}</small></div>
                            ))}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-4 mb-3 btn site-btn" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </Button>


                </Form>
            </div>

            {/* Loading Modal */}
            {loading && (
                <CustomModal
                    data={{
                        modal_title: "Register",
                        modal_body: (
                            <div className="align-items-center justify-content-center d-flex">
                                <div className="text-center">
                                    <Spinner animation="border" variant="primary"/>
                                    <p>{loadingMessage}</p>
                                </div>
                            </div>
                        ),
                        show_state: loading,
                        modal_size: "sm",
                    }}
                />
            )}

            {/* Success Modal */}
            {success && (
                <CustomModal
                    data={{
                        modal_title: "Register",
                        modal_body: (
                            <div className="align-items-center justify-content-center d-flex">
                                <div className="text-center">
                                    <CheckCircle size={32} color="green"/>
                                    <p>Registration Successful!</p>
                                </div>
                            </div>
                        ),
                        show_state: success,
                        modal_size: "sm",
                        auto_close_duration: timeout,
                    }}
                />
            )}

            {/* Error Modal */}
            {error && (
                <CustomModal
                    data={{
                        modal_title: "Register",
                        modal_body: (
                            <div className="align-items-center justify-content-center d-flex">
                                <div className="text-center">
                                    <XCircle size={32} color="red"/>
                                    <p>{error}</p>
                                </div>
                            </div>
                        ),
                        show_state: error,
                        modal_size: "sm",
                        auto_close_duration: timeout,
                    }}
                />
            )}

            {/* OTP Modal */}
            {otpModal && (
                <CustomModal
                    data={{
                        modal_title: "OTP Email Verification",
                        modal_body: <OTPForm onSubmit={handleOtpSubmit}/>,
                        show_state: otpModal,
                        modal_size: "md",
                    }}
                />
            )}
        </div>
    );
};

export const LoginInstead = () => {
    return (
        <div>
            <HorizontalRule ruleStyles="w-100 border-2 text-purple my-4"/>

            <div className="text-center">
                        <span className="d-flex flex-wrap justify-content-evenly align-items-center">
                            <span>Already have an account?</span>
                            <Link to="/login" className="small site-link link-purple"> Login</Link>
                        </span>
            </div>
        </div>
    )
}