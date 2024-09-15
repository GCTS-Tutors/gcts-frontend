import React from "react";
import { Spinner } from "react-bootstrap";
import {CheckCircle, XCircle} from "phosphor-react";


export const LoadingSuccessError = ({ message, icon, color }) => {
    // Render the appropriate icon based on the "icon" prop
    let IconComponent;
    switch (icon) {
        case "loading":
            IconComponent = Spinner;
            break;
        case "success":
            IconComponent = CheckCircle;
            break;
        case "error":
            IconComponent = XCircle;
            break;
        default:
            IconComponent = null;
    }

    return (
        <div className="align-items-center justify-content-center d-flex">
            <div className="text-center">
                {IconComponent && <IconComponent size={40} animation="border" variant="primary" color={color} />}
                <p>{message}</p>
            </div>
        </div>
    );
};

