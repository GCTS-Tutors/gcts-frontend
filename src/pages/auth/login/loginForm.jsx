// /src/pages/auth/login/loginForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CustomModal } from "../../../components/modal";
import { CheckCircle, XCircle } from "phosphor-react";
import { HorizontalRule } from "../../../components/elements";
import { useAuth } from "../../../context/AuthContext";
import PasswordField from "../../../components/PasswordField";


export const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const { login, loading, error, success } = useAuth();
    const navigate = useNavigate();
    const timeout = 3000;

    // Validation Functions
    const validateUsername = (value) => {
        let usernameErrors = [];
        if (!value) {
            usernameErrors.push("Username is required.");
        }
        return usernameErrors;
    };

    const validatePassword = (value) => {
        let passwordErrors = [];

        if (!value) {
            passwordErrors.push("Password is required.");
        } else {
            if (value.length < 8) {
                passwordErrors.push("Password must be at least 8 characters.");
            }
            if (value.length > 20) {
                passwordErrors.push("Password must be less than 20 characters.");
            }
        }

        return passwordErrors;
    };

    // useEffect to handle error validation
    useEffect(() => {
        const usernameError = validateUsername(formData.username);
        const passwordError = validatePassword(formData.password);

        setErrors({
            username: usernameError,
            password: passwordError
        });
    }, [formData.username, formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
    };

    const validateForm = () => {
        const usernameError = validateUsername(formData.username);
        const passwordError = validatePassword(formData.password);

        const formErrors = {
            username: usernameError,
            password: passwordError
        };

        setErrors(formErrors);
        return Object.keys(formErrors).every((key) => !formErrors[key]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await login(formData.username, formData.password);
        setTimeout(() => {
            navigate('/dashboard');
        }, timeout);
    };

    return (
        <div className="d-flex justify-content-evenly align-items-center min-vh-75">
            <div className="p-5 border rounded shadow w-100 my-5" style={{ maxWidth: "400px" }}>
                <h1 className="text-center text-purple">Login</h1>
                <HorizontalRule ruleStyles={" w-100 border-2 text-purple my-4"} />
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 d-flex flex-column justify-items-evenly align-items-start">
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
                        <Form.Control.Feedback type="invalid" className="text-start">
                            {errors.username && errors.username.map((error, index) => (
                                <div key={index}><small className="small text-danger">{error}</small></div>
                            ))}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <PasswordField label={"Password"} name={"password"} placeholder={"Enter password"} value={formData.password} onChange={handleChange} errors={errors.password} />

                    <Button variant="primary" type="submit" className="w-100 site-btn btn mt-3" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <HorizontalRule ruleStyles="w-100 border-2 text-purple my-4" />

                    <div className="text-center">
                        <span className="d-flex flex-wrap justify-content-evenly align-items-center">
                            <span>Don't have an account?</span>
                            <Link to="/register" className="link-purple small"> Register</Link>
                        </span>
                    </div>
                </Form>
            </div>

            {/* Loading Modal */}
            {loading && (
                <CustomModal
                    data={{
                        modal_title: "Login",
                        modal_body: (
                            <div className="align-items-center justify-content-center d-flex">
                                <div className="text-center">
                                    <Spinner animation="border" variant="primary" />
                                    <p>Logging in...</p>
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
                        modal_title: "Login",
                        modal_body: (
                            <div className="align-items-center justify-content-center d-flex">
                                <div className="text-center">
                                    <CheckCircle size={32} color="green" />
                                    <p>Login Successful!</p>
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
                        modal_title: "Login",
                        modal_body: (
                            <div className="align-items-center justify-content-center d-flex">
                                <div className="text-center">
                                    <XCircle size={32} color="red" />
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

        </div>
    );
};
