import {HorizontalRule} from "../../components/elements";
import Button from "react-bootstrap/Button";

export const Settings = (props) => {
    //const { userType } = props.data
    //const settingsType = FindUserSettings(userType)

    return (
        <div className="w-100 h-100 p-3 d-flex flex-column justify-content-evenly align-items-center">
            <div className="w-75">
                <h1 className="text-purple fs-1">Settings</h1>
                <HorizontalRule ruleStyles="w-60 border-2 text-purple "/>
            </div>
            {/* Email notifications */}
            <div className="">

            </div>
            {/* Marketing Notification */}
            <div className="">

            </div>
            {/* Delete account */}
            <div className="">
                <Button variant="danger">Delete Account</Button>
            </div>
        </div>
    )
}


function FindUserSettings(userType) {
    let userSettings
    switch (userType){
        case "admin":
            userSettings = (<AdminSettings/>);
            break;

        case "expert":
            userSettings = (<ExpertSettings/>);
            break;

        default:
            userSettings = (<LearnerSettings/>);
            break;
    }
    return userSettings
}

export const AdminSettings = () => {
    return (
        <div className="">
            Admin Custom Settings
        </div>
    )
}

export const ExpertSettings = () => {
    return (
        <div className="">
            Expert Custom Settings
        </div>
    )
}
export const LearnerSettings = () => {
    return (
        <div className="">
            Learner Custom Settings
        </div>
    )
}