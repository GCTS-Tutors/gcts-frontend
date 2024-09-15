import {HorizontalRule} from "./elements";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {SampleFaqs} from "../assets/data/sample_faqs";
import {Accordion, AccordionBody} from "react-bootstrap";

export const FaqsView = (props) => {
    return (
        <div className="min-vh-100 w-100 py-5">
            <div className="p-2 my-3">
                <p className="display-4">Frequently Asked Questions</p>

            </div>

            <div className="">
                <FaqsCategories/>
            </div>
        </div>
    )
}
export const FaqsCategories = () => {
    return (
        <div className="w-100">
            <Tabs defaultActiveKey="faqs" variant="pills"
                  className="d-flex flex-row justify-content-center align-items-center">
                <Tab eventKey="faqs" title="General">
                    <div className="my-2">
                        <FaqsByCategory category="General"/>
                    </div>
                </Tab>
                <Tab eventKey="account" title="Account">
                    <div className="my-2">
                        <FaqsByCategory category="Account"/>
                    </div>
                </Tab>
                <Tab eventKey="orders" title="Orders">
                    <div className="my-2">
                        <FaqsByCategory category="Orders"/>
                    </div>
                </Tab>
                <Tab eventKey="profile" title="Profile">
                    <div className="my-2">
                        <FaqsByCategory category="Profile"/>
                    </div>
                </Tab>
                <Tab eventKey="transactions" title="Transactions">
                    <div className="my-2">
                        <FaqsByCategory category="Transactions"/>
                    </div>
                </Tab>

            </Tabs>

        </div>
    )
}

export const Faq = (props) => {
    const {question, answer, link} = props.data
    return (
        <Accordion.Item eventKey={props.id}
            className="m-auto p-3 w-90 text-start d-flex flex-column justify-content-start">
            <Accordion.Header className="w-100">
                <div className="d-flex flex-row justify-content-start w-100 ">
                    <span className="me-2 text-purple fs-6">{props.id}.</span>
                    <span className="w-100 text-purple ms-1 fs-6">{question}</span>
                </div>
            </Accordion.Header>
            <AccordionBody className="w-100 h-100 d-flex justify-content-center align-items-center">
                <p className="w-100">{answer}</p>
            </AccordionBody>
            <p>{link}</p>
        </Accordion.Item>
    )
}
Faq.defaultProps = {
    data: {
        question: "This is the question",
        answer: "An answer",
        link: "Link",
    }
}

export const FaqReaction = (props) => {
    return (
        <div className="">
            <div className="">Like</div>
            <div className="">Dislike</div>
        </div>
    )
}


export const FaqsByCategory = (props) => {
    let categoryFaqs = []
    const all_faqs = SampleFaqs.filter((faq) => faq.category === props.category)
    all_faqs.forEach((faq,index) => {
        categoryFaqs.push({
            id: index + 1,
            faq: faq,
        });
    });
    return (
        <div className="w-100 d-flex flex-column justify-content-evenly align-items-center">
            <div className="my-2 w-fit-content p-3">
                <p className="display-6">{props.category}</p>
                <HorizontalRule ruleStyles="w-100 border-2 text-purple"/>
            </div>
            <Accordion defaultActiveKey="" className=" w-90 " style={{maxWidth: "700px"}}>
                {
                    categoryFaqs.map((faq, index) => (
                        <Faq data={faq.faq} id={faq.id}/>
                    ))
                }

            </Accordion>

        </div>

    )
}
