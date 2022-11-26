import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Conversations.css";

export default function Conversations({ conversation, currentUser }) {
    const [user, setUser] = useState(null);
    const PF =
        process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images";

    useEffect(() => {
        const friendId = conversation.members.find((m) => {
            return m !== currentUser?._id;
        });

        const getUser = async () => {
            try {
                const res = await axios.get(`/api/users?userId=${friendId}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
                alert("Could not get user");
            }
        };
        getUser();
    }, [currentUser,conversation]);

    return (
        <div className="conversations">
            <Link to={`/profile/${user?.userAddress}`}>
                <img
                    src={
                        user?.profilePicture
                            ? user.profilePicture
                            : PF + "/user.png"
                    }
                    alt=""
                    className="conversations__image"
                />
            </Link>
            <span className="conversations__name">{user?.userName}</span>
        </div>
    );
}
