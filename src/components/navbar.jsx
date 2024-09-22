import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import {Link} from "react-router-dom";
import {Button, Image} from "react-bootstrap";
import {SiteData} from "../assets/data/site";
import {useAuth} from "../context/AuthContext";
import {House, Info, Scroll, SignIn, SignOut, User} from "phosphor-react";


export const CustomNavbar = () => {
    const {user, logout} = useAuth();

    return (
        <Navbar expand="lg" className="navbar px-3 bg-color-accent">
            <Container className="w-100 p-2 d-flex flex-row justify-content-between">
                <Navbar.Brand className="w-30">
                    <Link className="d-flex flex-row align-items-center" to="/">
                        <Image src={SiteData.logo} fluid width={'75px'} className='mx-1'/>
                        <span className="fs-1 fw-semibold mx-1">{SiteData.site_abbrev}</span>
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="custom-navbar"/>
                <Navbar.Collapse className="w-70">
                    <Nav className="w-100">
                        <div className="d-flex flex-row flex-sm-column justify-content-evenly w-100">
                            <div className="mx-2 d-flex flex-row justify-content-center align-items-center text-black">
                                <div className="mx-1 w-60 d-flex flex-column flex-md-row justify-content-start align-items-center">
                                    <Nav.Link className="p-2 mx-2">
                                        <Link to="/"
                                              className="w-100 d-flex flex-row justify-content-center align-items-center">
                                            <span className="me-2"><House size={24} color="black"/></span>
                                            <span>Home</span>
                                        </Link>
                                    </Nav.Link>
                                    <Nav.Link className="p-2 mx-2">
                                        <Link to="/papers"
                                              className="w-100 d-flex flex-row justify-content-center align-items-center">
                                            <span className="me-2"><Scroll size={24} color="black"/></span>
                                            <span>Papers</span>
                                        </Link>
                                    </Nav.Link>

                                    <Nav.Link className="p-2 mx-2">
                                        <Link to="/faqs"
                                              className="w-100 d-flex flex-row justify-content-center align-items-center">
                                            <span className="me-2"><Info size={24} color="black"/></span>
                                            <span>FAQs</span>
                                        </Link>
                                    </Nav.Link>
                                </div>
                                <div className="mx-1 w-40 d-flex flex-column flex-md-row justify-content-end align-items-center">
                                    {user ? (
                                        <>
                                            <Nav.Link className="p-2 mx-2">
                                                <Link to="/dashboard"
                                                      className="w-100 d-flex flex-row justify-content-center align-items-center">
                                                    <span className="me-2"><User size={24} color="black"/></span>
                                                    <span>Dashboard</span>
                                                </Link>
                                            </Nav.Link>
                                            <Button onClick={logout} className="btn bg-black text-white" variant="dark">
                                                <span className=""><SignOut size={24} color="white"/></span>
                                                <span className="text-white">Logout</span>
                                            </Button>
                                            </>
                                        ) : (
                                        <Nav.Link>
                                        <Link
                                        className="btn bg-black text-white d-flex flex-row justify-content-center align-items-center"
                                        to="/login">
                                        <span className="me-2"><SignIn size={24} color="white"/>
                            </span>
                            <span className="text-white">Login</span>
                        </Link>
                    </Nav.Link>

                    )}
                </div>
            </div>
        </div>

</Nav>
</Navbar.Collapse>

</Container>
</Navbar>


)
};
