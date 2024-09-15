import React from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";

export const CustomOffcanvas = (props) => {
    const { menu_name, offcanvas_body } = props.data
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <div className="">
            <Button className="btn bg-black" onClick={handleShow}>{menu_name}</Button>
            <Offcanvas
                show={show}
                onHide={handleClose}
                className="bg-color-main"
            >
                <Offcanvas.Header closeButton>

                </Offcanvas.Header>
            </Offcanvas>
        </div>
    )
}

CustomOffcanvas.defaultProps = {
    data: {
        menu_name: "Dashboard",
        offcanvas_body: (
            <p>Nothing to show.</p>
        ),

    }


}
