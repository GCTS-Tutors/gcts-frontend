// /src/pages/auth/resetpassword/resetPasswordPage.jsx

import React from "react";
import {HorizontalRule} from "../../../components/elements";
import { ResetPasswordForm } from "./resetPasswordForm";


export const ResetPasswordPage = () => {

    return (
        <div className="d-flex justify-content-evenly align-items-center">
            <div className="p-5 rounded w-100 my-5 box-shadow-6" style={{maxWidth: "450px"}}>
                <h1 className="text-center fw-semibold text-purple">Reset Password</h1>

                <HorizontalRule ruleStyles={" w-100 border-2 text-purple my-4"} />
                <ResetPasswordForm  />
                
            </div>
        </div>

    )
}