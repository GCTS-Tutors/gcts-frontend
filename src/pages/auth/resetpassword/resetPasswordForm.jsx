import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../../components/PasswordField";
import OTPForm from "../../../components/OTPForm";
import {CustomModal, ModalContent} from "../../../components/modal";
import { validateEmail, validatePassword, validateConfirmPassword } from "../../../utils/utils";
import { generateOTP, resetPassword, verifyOTP } from "../../../api";


export const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        modal_title: "Reset Password",
        modal_body: "",
        show_state: false,
        modal_size: "md",
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        email: [],
        password: [],
        confirmPassword: [],
    });

    useEffect(() => {
        const emailErrors = validateEmail(formData.email);
        const passwordErrors = validatePassword(formData.password);
        const confirmPasswordErrors = validateConfirmPassword(formData.password, formData.confirmPassword);
        setErrors({
            email: emailErrors,
            password: passwordErrors,
            confirmPassword: confirmPasswordErrors,
        });
    }, [formData.email, formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOtpSubmit = async (otp) => {
        
        try {
            const response = await verifyOTP(formData.email, otp, true);
            setShowPasswordFields(true);
            setModalData({
                ...modalData,
                modal_body: (<ModalContent type="success" message="OTP Verified!" />)
            });
        } catch (error) {
            setModalData({
                ...modalData,
                modal_body: (<ModalContent type="error" message="OTP Verification Failed!" />)
            });
        } finally {
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        }
    };

    const validateForm = () => {
        const emailErrors = validateEmail(formData.email);
        const passwordErrors = validatePassword(formData.password);
        const confirmPasswordErrors = validateConfirmPassword(formData.password, formData.confirmPassword);
        setErrors({
            ...errors,
            email: emailErrors,
            password: passwordErrors,
            confirmPassword: confirmPasswordErrors,
        });
        return emailErrors.length === 0 && passwordErrors.length === 0 && confirmPasswordErrors.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(true);
        
        // If initial submission, generate OTP
        if (!showPasswordFields) {
            setModalData({
                ...modalData,
                show_state: true,
                modal_body: (<ModalContent type="loading" message="Generating OTP..." />),
            });
            try {
                await generateOTP(formData.email, true);
                setModalData({
                    ...modalData,
                    modal_body: (<OTPForm onSubmit={handleOtpSubmit} />),
                });
            } catch (error) {
                setModalData({
                    ...modalData,
                    modal_body: (<ModalContent type="error" message="OTP Generation Failed!" />)
                });
            } 
        } else {
            // Submit form data            
            setModalData({
                ...modalData,
                modal_body: (<ModalContent type="loading" message="Resetting password..." />),
                show_state: true,
            });
            try {
                const response = await resetPassword(formData.email, formData.password);
                
                setModalData({
                    ...modalData,
                    modal_body: (<ModalContent type="success" message="Password Reset Successful!" />),
                });
            } catch (error) {
                setModalData({
                    ...modalData,
                    modal_body: (<ModalContent type="error" message="Password Reset Failed!" />)
                });
            } finally {
                setTimeout(() => {
                    setShowModal(false);
                    navigate("/login");
                }, 3000);
            }
        }
        
    };

    return (
        <div className="d-flex justify-content-evenly align-items-center w-100">
            <div className="w-100">

                <Form onSubmit={handleSubmit} className="w-100 mx-auto">
                    <Form.Group className="my-2 text-start">
                        <Form.Label className="text-purple">Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your account email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoFocus
                            required
                            disabled={showPasswordFields}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.map((error, index) => (
                                <div key={index} className="text-danger">{error}</div>
                            ))}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* Only display password fields if token is valid */}
                    {showPasswordFields && (
                        <>
                            <PasswordField
                                label={"New Password"}
                                name="password"
                                placeholder={"Enter new password"}
                                value={formData.password}
                                onChange={handleChange}
                                errors={errors.password}
                            />
                            <PasswordField
                                label={"Confirm Password"}
                                name="confirmPassword"
                                placeholder={"Confirm password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                errors={errors.confirmPassword}
                            />
                        </>
                    )}
                    

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 mt-4 mb-3 btn site-btn"
                    >
                        { showPasswordFields ? "Reset Password" : "Generate OTP" }
                    </Button>
                </Form>

            </div>

            {showModal && (
                <CustomModal 
                    data={modalData}
                />
            )}
            
        </div>
    )
}