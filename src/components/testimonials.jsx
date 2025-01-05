import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import logo from "../assets/logos/logo.png";
import ReactStars from 'react-stars';
import { getReviews } from "../api";
import { HorizontalRule } from "../components/elements";
import Carousel from "react-bootstrap/Carousel";
import testimonial_bg from "../assets/images/pawel-czerwinski-xWSUI7tpiTY-unsplash.jpg";
import { FormatDateTime } from "../utils/utils";
import { subjects } from "../assets/data/orders";

export const Testimonials = (props) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch reviews
        const retrieveReviews = async () => {
            try {
                const response = await getReviews();
                setReviews(response);
            } catch (error) {
                return [];
            }
        }
        retrieveReviews();
    }, []);


    return (
        <div className="w-100 p-2">
            <div className="">
                <h1 className="fs-1 text-purple">Testimonials</h1>
                <p className="lead text-purple">Hear it from our high achievers.</p>
            </div>
            <div className="w-90 mx-auto box-shadow-6 rounded-2">
                <Carousel className="">
                    {(
                        reviews?.map((review) => (
                            <Carousel.Item key={review.id}>
                                <Image className="w-100 h-100 object-fit-cover rounded-2" src={testimonial_bg} />
                                <Carousel.Caption className="w-70 h-70 centered rounded-2">
                                    <Testimonial data={review} />
                                </Carousel.Caption>
                            </Carousel.Item>))
                    )}

                </Carousel>
            </div>
        </div>
    )
}

export const Testimonial = (props) => {
    
    const { review, rating, created_at, order_subject } = props.data;
    
    return (
        <div className="w-100 p-2 d-flex flex-column justify-content-center align-items-center">
            <div className="p-3 bg-white w-90 rounded-2 box-shadow-8 mb-5 d-flex flex-column justify-content-center align-items-center">                
                <ReactStars count={5} value={rating} size={32} color2={"#ffd700"} edit={false} />
                <HorizontalRule ruleStyles={"w-20 border-2 text-purple my-4"} />
                <p className="w-80 p-2 text-wrap text-truncate">{review}</p>
            </div>
            <div className="p-2 bg-off-white w-70 mx-auto h-100 rounded-2 box-shadow-1 d-flex flex-column justify-content-center align-items-center">
                <TestimonialId subject={order_subject} created_at={created_at} />
            </div>

        </div>
    )
}




const TestimonialId = (props) => {
    return (
        <div className="w-fit-content mx-auto p-2  d-flex flex-row justify-content-center align-items-center">
            <div className="w-20">
                <Image src={logo} rounded fluid width={"50px"} />
            </div>
            <div className="w-80 ms-2 text-start small d-flex flex-column justify-content-start align-items-start">
                <span className="fw-semibold small text-purple">{subjects[props?.subject]} student</span>
                <span className="smaller">{FormatDateTime(props?.created_at)}</span>
            </div>
        </div>
    )
};

