import React, { useState, useEffect } from "react";
import ReactStars from "react-stars";
import { Form, Button } from "react-bootstrap";
import { FormatTime } from "../../components/date_time";
import { createOrderComment, getOrderComments, createOrderReview } from "../../api";
import { useAuth } from "../../context/AuthContext";


export const Comments = ({ order }) => {
    const { user } = useAuth();  // Retrieve the currently authenticated user
    const [comment, setComment] = useState("");
    const [validated, setValidated] = useState(false);
    const [commentError, setCommentError] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const getComments = async () => {
            const response = await getOrderComments(order);
            setComments(response);
        }
        getComments();
    }, [order]);

    const handleAddComment = async (newComment) => {
        if (newComment.trim()) {
            try {
                await createOrderComment({ order: order, comment: newComment });
                // reload the comments
                const response = await getOrderComments(order);
                setComments(response);
            } catch (error) {
                // TODO: Replace with a modal notification
                console.error("Error adding comment:", error);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false || !comment) {
            e.stopPropagation();
            setCommentError(true);
            setValidated(true);
            return;
        }

        // Assume onSubmit is the function to handle comment submission
        handleAddComment(comment);

        // Reset form state after successful submission
        setComment("");
        setValidated(false);
        setCommentError(false);
    };

    return (
        <div className="comments-section p-3">
            {/* Heading */}
            <h5 className="text-purple fw-semibold me-1 text-center">Comments</h5>
            {/* Add new comment */}
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-3">
                <Form.Group controlId="formComment" className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Write your comment here..."
                        className="rounded-top rounded-bottom-0"
                        isInvalid={commentError}
                    />
                    <Button type="submit" className="w-100 site-btn rounded-bottom rounded-top-0">
                        Post Comment
                    </Button>
                    <Form.Control.Feedback type="invalid">
                        Please write a comment before submitting.
                    </Form.Control.Feedback>
                </Form.Group>


            </Form>

            {/* Render all comments */}
            <div className="comments-container" style={{ "overflow-y": "scroll" }}>
                {comments.map((comment, index) => (
                    <Comment key={index} comment={comment} currentUser={user} />
                ))}
            </div>

        </div>
    );
};

export const Comment = ({ comment, currentUser }) => {
    const isCurrentUser = currentUser.id === comment.user?.id;

    return (
        <div
            className={`comment-container ${isCurrentUser ? 'current-user' : 'other-user'}`}
            style={{ float: isCurrentUser ? 'left' : 'right', clear: 'both', marginBottom: '10px' }}
        >
            <div className="comment-body p-2 border rounded">
                <p>{comment.comment}</p>
            </div>
            <div className="comment-meta">
                <small>{comment.user?.username}</small> - <small>{FormatTime(comment.created_at)}</small>
            </div>
        </div>
    );
};


export const Review = ({ order }) => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [validated, setValidated] = useState(false);
    const [reviewError, setReviewError] = useState(false);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false || !review) {
            e.stopPropagation();
            setReviewError(true);
            setValidated(true);
            return;
        }

        // Assume onSubmit is the function to handle comment submission
        try {
            const response = await createOrderReview({ 'order': order, 'review': review, 'rating': rating });
        } catch (e) {
            // TODO: Replace with a modal notification
            console.error(e);
        }

        // Reset form state after successful submission
        setReview("");
        setRating(5);
        setValidated(false);
        setReviewError(false);
    };

    return (
        <div className="comments-section p-3">
            {/* Heading */}
            <h5 className="text-purple fw-semibold me-1 text-center">Review</h5>
            {/* Add new comment */}
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-3">
                <div className="d-flex justify-content-center">
                    <ReactStars
                        count={5}
                        value={rating}
                        onChange={handleRatingChange}
                        size={32}
                        color2={"#ffd700"}
                    />
                </div>
                
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                        placeholder="Write your review here... let other students know how we did!"
                        className="rounded-top rounded-bottom-0"
                        isInvalid={reviewError}
                    />
                    <Button type="submit" className="w-100 site-btn rounded-bottom rounded-top-0">
                        Post Review
                    </Button>
                    <Form.Control.Feedback type="invalid">
                        Please write a review before submitting.
                    </Form.Control.Feedback>
                </Form.Group>

            </Form>

        </div>
    );
};