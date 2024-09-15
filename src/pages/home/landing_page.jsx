import {Testimonials} from "../../components/testimonials";
import {SiteData} from "../../assets/data/site";
import {Image} from "react-bootstrap";
import {HorizontalRule, toTitleCase} from "../../components/elements";
import {CustomCarousel} from "../../components/carousel";
import {GuideSection} from "./guideSection";
import {SamplePosts} from "../../assets/data/sample_posts";
import {BlogPost} from "../blog/blog";
import {OrderForm} from "../orders/order_form";
import {SampleReviews} from "../../assets/data/reviews";
import {Slides} from "../../assets/data/landing_slides";

export const LandingPage = (props) => {
    return (
        <div className="d-flex flex-column justify-content-evenly align-items-center min-vh-100 w-100 py-5">
            <div className="my-3">
                <PageData/>
            </div>
            <div className="w-90 mx-auto my-5">
                <CustomCarousel slides={Slides}/>
            </div>


            <div id="get-started" className="my-3">
                <GuideSection />
            </div>

            <HorizontalRule ruleStyles={"w-60 border-2 brand-border my-5"} />

            <div id="place-order" className="w-80" style={{ minWidth: '400px'}}>
                <HomeOrderForm />
            </div>

            <HorizontalRule ruleStyles={"w-90 border-2 brand-border my-5"} />

            <div className="w-100" id="testimonials">
                <Testimonials testimonials={props.testimonials} />
            </div>

            <HorizontalRule ruleStyles={"w-90 border-2 brand-border my-5"} />

            <div id="sample-papers">
                <SamplePapers />
            </div>
        </div>
    );
}
LandingPage.defaultProps = {
    testimonials: SampleReviews
}

const HomeOrderForm = () => {
    return (
        <div className="w-100">
            <OrderForm/>
        </div>
    )
}

const PageData = () => {
    return (
        <div className="d-flex flex-column justify-content-evenly align-items-center p-2 mt-3">
            <div className="m-2 d-flex flex-column justify-content-evenly">
                <span className="display-6">Welcome to</span>
                <span className="display-5">{SiteData.site_name}</span>
            </div>
            <div className="m-1">
                <Image src={SiteData.logo_purple} fluid width={'50px'}/>
            </div>
            <div className="m-2">
                <span className="lead">{toTitleCase(SiteData.slogan)}.</span>
            </div>
            <div className="mt-5">
                <a href="#get-started" className="btn site-btn">Get Started</a>
            </div>
        </div>
    )
}

const SamplePapers = () => {
    return (
        <div className="d-flex flex-column justify-content-evenly align-items-center w-100 p-3">
            <div className="">
                <h1 className="fs-1 mt-3 text-purple">Sample Papers</h1>
                <p className="lead  text-black-50">Take a sneak peek at some of our sample academic papers.</p>
            </div>

            <div
                className="overflow-x-scroll sample-papers-section p-3 d-flex flex-row justify-content-around align-items-center">
                {
                    SamplePosts.map((post) => (
                        <div className="sample-post w-auto m-2 h-100">
                            <BlogPost data={post}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}