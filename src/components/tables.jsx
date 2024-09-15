import {Link} from "react-router-dom";

export const ViewItemButton = (props) => {
    return (
        <div className="w-100">
            <Link to={props.link} className="link-purple smaller">View</Link>
        </div>
    )
}