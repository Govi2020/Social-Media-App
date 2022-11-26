import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Online.css";

export default function Online({ user }) {
    const [friend, setFriend] = useState(null);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(async () => {
        try {
            const res = await axios.get("/api/users?userId=" + user);
            setFriend(res.data);
        } catch (err) {
            alert("Cannot get Online Friend");
        }
    }, []);
    return (
        <>
            <li style={{ display: "flex", alignItems: "center" }}>
                <div className="rightbar__image-container">
                    <img
                        src={
                            friend?.profilePicture
                                ? friend?.profilePicture
                                : PF + "/user.png"
                        }
                        alt="friend__photo"
                        className="rightbar__friendPhoto"
                    />
                    <span className="rightbar__online"></span>
                </div>
                <Link
                    to={"/profile/" + friend?.userAddress}
                    className="rightbar__friendName"
                >
                    {friend?.userName}
                </Link>
            </li>
        </>
    );
}
