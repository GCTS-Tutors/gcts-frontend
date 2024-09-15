// /src/pages/auth/login/registerPage.jsx

import React from "react";
import {LoginInstead, RegisterForm} from "./registerForm";
import {HorizontalRule} from "../../../components/elements";


export const RegisterPage = () => {

    return (
        <div className="d-flex justify-content-evenly align-items-center">
            <div className="p-5 rounded w-100 my-5 box-shadow-6" style={{maxWidth: "450px"}}>
                <h1 className="text-center fw-semibold text-purple">Register</h1>

                <HorizontalRule ruleStyles={" w-100 border-2 text-purple my-4"} />
                <RegisterForm />
                <LoginInstead/>

            </div>
        </div>

    )
}