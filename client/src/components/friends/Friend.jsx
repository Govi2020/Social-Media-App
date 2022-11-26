import React from "react";
import { Link } from "react-router-dom";
import "./Friend.css";

export default function Friend({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <Link to={`/profile/${user.userAddress}`}>
            <li className="sidebar__friend">
                <img
                    src={
                        user.profilePicture
                            ? user.profilePicture
                            : PF + "/user.png"
                    }
                    alt="friends photo"
                    className="sidebar__friendImg"
                />
                <span className="sidebar__friendName">{user?.userName}</span>
            </li>
        </Link>
    );
}
