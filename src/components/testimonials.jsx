import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import default_user from "../assets/icons/incognito.png"
import { getReviews } from "../api";
import { FormatDateTime } from "../utils/utils.js";
import { ThumbsUp } from "phosphor-react";
import Carousel from "react-bootstrap/Carousel";
import testimonial_bg from "../assets/images/pawel-czerwinski-xWSUI7tpiTY-unsplash.jpg"
import { SiteData } from "../assets/data/site";

export const Testimonials = (props) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch reviews
        getReviews().then((data) => {
            setReviews(data);
        });
    }, []);


    return (
        <div className="w-100 p-2">
            <div className="">
                <h1 className="fs-1 text-purple">Testimonials</h1>
                <p className="lead text-purple">Hear it from our high achievers.</p>
            </div>
            <div className="w-90 mx-auto box-shadow-6 rounded-2">
                <Carousel className="">
                    {reviews && Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Carousel.Item key={review.id}>
                                <Image className="w-100 h-100 object-fit-cover rounded-2" src={testimonial_bg} />
                                <Carousel.Caption className="w-70 h-70 centered rounded-2">
                                    <Testimonial data={review} />
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item>
                            <Image className="w-100 h-100 object-fit-cover rounded-2" src={testimonial_bg} />
                            <Carousel.Caption className="w-70 h-70 centered rounded-2">
                                <p className="p-3 bg-light rounded">Retrieving reviews...</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )}

                </Carousel>
            </div>
        </div>
    )
}

export const Testimonial = (props) => {
    const { review, user, created_at } = props.data
    return (
        <div className="w-100 p-2 d-flex flex-column justify-content-center align-items-center">
            <div className="p-3 bg-white w-90 rounded-2 box-shadow-8 mb-5 d-flex flex-column justify-content-center align-items-center">
                <div className="img w-20 p-2">
                    <ThumbsUp size={36} color={SiteData.site_colours.accent_colour} />
                </div>
                <p className="w-80 p-2 text-wrap">{review}</p>
            </div>
            <div className="p-2 bg-off-white w-70 mx-auto h-100 rounded-2 box-shadow-1 d-flex flex-column justify-content-center align-items-center">
                <TestimonialId profile={user} created_at={created_at} />
            </div>

        </div>
    )
}

Testimonial.defaultProps = {
    comment: "This is the testimonial.",
    profile: default_user,
};


const TestimonialId = (props) => {
    return (
        <div className="w-fit-content mx-auto p-2  d-flex flex-row justify-content-center align-items-center">
            <div className="w-20">
                <Image src={default_user} rounded fluid width={"50px"} />
            </div>
            <div className="w-80 ms-2 text-start small d-flex flex-column justify-content-start align-items-start">
                <span className="fw-semibold small text-purple">{props.profile?.username || "Anonymous"}</span>
                <span className="smaller">{FormatDateTime(props.created_at)}</span>
            </div>
        </div>
    )
};

