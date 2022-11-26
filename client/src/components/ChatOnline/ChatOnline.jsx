import "./ChatOnline.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ChatOnline({
    userId,
    setCurrentChat,
    setCurrent,
    setOnlineUsers,
    onlineUsers,
}) {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await axios.get("/api/users/friends/" + userId);
                setFriends(res.data);
            } catch (err) {
                console.log(err);
                alert("Failed to get friends");
            }
        };
        getFriends();
    }, []);

    useEffect(() => {
        setOnlineFriends(
            friends.filter((f) => {
                return onlineUsers.includes(f._id);
            })
        );
    }, [friends, onlineUsers]);

    const PF =
        process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images";

    return (
        <div className="chat__online">
            {onlineFriends?.map((online) => {
                return (
                    <Link className="chat__online-friend" to={"/profile/" + online.userAddress}>
                        <div className="chat__online-image-container">
                            <img
                                src={
                                    online?.profilePicture
                                        ? online?.profilePicture
                                        : PF + "/user.png"
                                }
                                alt=""
                                className="chat__online-image"
                            />
                            <div className="chat__online-badge"></div>
                        </div>
                        <div className="chat__online-name">
                            {online.userName}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
