import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

export const CustomCarousel = (props) => {
    return (
        <div className="w-100 box-shadow-5">
            <Carousel fade interval={3000}>
                {
                    props.slides.map((slide) => (
                        <Carousel.Item key={slide.title} className="w-100 h-100 centered">
                            <Image className="w-100 h-100 object-fit-cover" src={slide.cover_img} fluid alt={slide.title} />
                            <Carousel.Caption className="p-5 box-shadow-6 bg-off-white centered w-70 h-70 d-flex flex-column justify-content-evenly align-items-center">
                                <h1 className="text-black">{slide.title}</h1>
                                <p className="fs-6">{slide.description}</p>
                                <Link className="btn site-btn w-40" to={slide.button.link} title={slide.button.id}>{slide.button.id}</Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))
                }
            </Carousel>
        </div>
    )
}
