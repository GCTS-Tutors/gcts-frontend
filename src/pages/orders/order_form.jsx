import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../../api";
import { CustomModal, ModalContent } from "../../components/modal";
import { useAuth } from "../../context/AuthContext";
import { Row, Col } from "react-bootstrap"; // Import Row and Col from react-bootstrap

export const OrderForm = (props) => {
    const { user } = useAuth();
    const initialFormState = {
        topic: "",
        type: "essay",
        level: "undergraduate",
        language: "english US",
        min_pages: 1,
        max_pages: 1,
        instructions: "",
        deadline: "",
        sources: 0,
        style: "apa",
        urgency: "low",
        files_link: "",
    }
    const [formData, setFormData] = useState(initialFormState);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        // Submit the order to the API and get the id to use to submit the files
        try {
            await createOrder(formData);
            setError(null);
            setSuccess(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);            
        } catch (error) {
            setError("There was an error submitting your order. Please try again.");
        } finally {
            setLoading(false);
            if (success) setFormData(initialFormState);
        }
    };

    return (
        <div className="w-100 p-2">
            <Form className="w-100 my-3" onSubmit={handleSubmit}>
                {/* Form Header */}
                <Form.Group>
                    <h1 className="fs-1 text-purple">Make an Order</h1>
                    <p className="lead text-purple">Fill the form to place an order</p>
                </Form.Group>

                <Row className="w-100 mx-auto">
                    {/* Left Column */}
                    <Col md={6}>
                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">
                                Assignment Title <span className="text-danger">*</span>
                            </Form.Text>
                            <Form.Control
                                as="input"
                                placeholder="e.g. Managing Infectious Diseases"
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                maxLength={100}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">Instructions & Guidelines</Form.Text>
                            <Form.Control
                                as="textarea"
                                placeholder="Provide any additional information or guidelines given."
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                rows={7}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                                <Form.Text className="mb-2 ms-1">Minimum number of pages</Form.Text>
                                <Form.Control
                                    as="input"
                                    type="number"
                                    name="min_pages"
                                    defaultValue={1}
                                    value={formData.min_pages}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </Form.Group>

                            <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                                <Form.Text className="mb-2 ms-1">Maximum number of pages</Form.Text>
                                <Form.Control
                                    as="input"
                                    type="number"
                                    name="max_pages"
                                    defaultValue={1}
                                    value={formData.max_pages}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </Form.Group>
                        </div>


                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">Number of Sources Required</Form.Text>
                            <Form.Control
                                as="input"
                                type="number"
                                min={0}
                                defaultValue={0}
                                name="sources"
                                value={formData.sources}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">
                                Files
                            </Form.Text>
                            <Form.Control
                                as="input"
                                placeholder="https://file.io/hhajgdedh"
                                type="text"
                                name="files_link"
                                value={formData.files_link}                                
                                onChange={handleChange}
                                maxLength={255}
                            />
                            <Form.Text className="text-muted">
                                Upload files on GDrive/file.io/mediafire and share link.
                            </Form.Text>
                        </Form.Group>

                    </Col>

                    {/* Right Column */}
                    <Col md={6} className="form-column">


                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">
                                Type of Assignment <span className="text-danger">*</span>
                            </Form.Text>
                            <Form.Select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="essay" defaultValue>Essay</option>
                                <option value="research paper">Research Paper</option>
                                <option value="capstone project">Capstone Project</option>
                                <option value="class discussion">Class Discussion</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">
                                Level of education <span className="text-danger">*</span>
                            </Form.Text>
                            <Form.Select
                                placeholder="Education Level"
                                type="text"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                maxLength={50}
                                required
                            >
                                <option value="undergraduate" defaultValue>Undergraduate</option>
                                <option value="graduate">Graduate</option>
                                <option value="phd">PHD</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">
                                Language <span className="text-danger">*</span>
                            </Form.Text>
                            <Form.Select
                                placeholder="Solution Language"
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                required
                            >
                                <option value="english US" defaultValue>English (US)</option>
                                <option value="english UK">English (UK)</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">
                                Urgency <span className="text-danger">*</span>
                            </Form.Text>
                            <Form.Select
                                name="urgency"
                                value={formData.urgency}
                                onChange={handleChange}
                                required
                            >
                                <option value="low" defaultValue>Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">
                                Deadline <span className="text-danger">*</span>
                            </Form.Text>
                            <Form.Control
                                as="input"
                                type="datetime-local"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="p-1 my-2 d-flex flex-column justify-content-evenly align-items-start">
                            <Form.Text className="mb-2 ms-1">Citation Style</Form.Text>
                            <Form.Select
                                name="style"
                                value={formData.style}
                                onChange={handleChange}
                            >
                                <option value="apa" defaultValue>APA</option>
                                <option value="mla">MLA</option>
                                <option value="chicago">Chicago</option>
                            </Form.Select>
                        </Form.Group>

                    </Col>
                </Row>

                

                {/* Submit Button */}
                <Form.Group className="p-1 mt-5 d-flex flex-column justify-content-evenly align-items-start files mx-auto">
                    {user ? (<Button type="submit" className="site-btn w-60 mx-auto p-2" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>) : (
                        <Link to="/login" className="site-btn w-60 mx-auto text-white rounded p-2">Login to Place Order</Link>
                    )}
                </Form.Group>
            </Form>
            {/* Loading Modal */}
            {loading && (
                <CustomModal
                    data={{
                        modal_title: "Place Order",
                        modal_body: (
                            <ModalContent
                                type="loading"
                                message="Submitting..."
                            />
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
                        modal_title: "Place Order",
                        modal_body: (
                            <ModalContent
                                type="success"
                                message="Order Placed Successfully!"
                            />
                        ),
                        show_state: success,
                        modal_size: "sm",
                        auto_close_duration: 3000,
                    }}
                />
            )}

            {/* Error Modal */}
            {error && (
                <CustomModal
                    data={{
                        modal_title: "Place Order",
                        modal_body: (
                            <ModalContent
                                type="error"
                                message="Order Submission Failed!"
                            />
                        ),
                        show_state: error,
                        modal_size: "sm",
                        auto_close_duration: 3000,
                    }}
                />
            )}
        </div>
    );
};
