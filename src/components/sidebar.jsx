import React, {useState} from "react";


export const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebar = () => {
        setIsCollapsed((!isCollapsed));
    }

    return (
        <div className={`bg-purple sidebar ${isCollapsed ? ' collapsed ' : ''}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isCollapsed ? 'Expand' : 'Collapse'}
            </button>
            <ul>
                <li><a href="#"><i className="fi fi-ss-form"></i><span>Requests</span></a></li>
                <li><a href="#"><i className="fi fi-ss-form"></i><span>Reviews</span></a></li>
                <li><a href="#"><i className="fi fi-ss-form"></i><span>Orders</span></a></li>

            </ul>
            <ul>
                <li><a href="#"><i className="fi fi-ss-form"></i><span>Settings</span></a></li>

            </ul>
        </div>
    );
}

export const AdminSidebarLinks = () => {
    return (
        <div className="">
            <ul>
                <li><a href="#"><i className="fi fi-ss-form"></i><span>Requests</span></a></li>
                <li><a href="#"><i className="fi fi-ss-form"></i><span>Reviews</span></a></li>
                <li><a href="#"><i className="fi fi-ss-form"></i><span>Orders</span></a></li>

            </ul>
        </div>
    )
}

export const SidebarPills = () => {
    return (
        <div className="">

        </div>
    )
}