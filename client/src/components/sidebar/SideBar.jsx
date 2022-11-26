import "./Sidebar.css";
import {
    RssFeed,
    PlayCircleOutline,
    Group,
    WorkOutline,
    Event,
    Star,
    Image,
    ArrowBack,
    ArrowForward,
    Chat
} from "@material-ui/icons";
import Friend from "../friends/Friend";
import { Link } from "react-router-dom";
import { Users } from "../../dummyData";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function SideBar() {
    const [friends, setFriends] = useState([]);
    const { user } = useContext(AuthContext);
    const [sideClass, setSideClass] = useState(false);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await axios.get(`/api/users/friends/${user?._id}`);
                // console.clear();
                setFriends(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, [user?._id, user]);

    return (
        <>
            <div
                className={
                    !sideClass
                        ? "sidebar__toggle-active sidebar__toggle"
                        : "sidebar__toggle"
                }
                onClick={() => {
                    setSideClass(!sideClass);
                }}
            >{sideClass ? <ArrowBack/> : <ArrowForward/>}</div>
            <div className={`sidebar ${sideClass ? "sidebar-active" : ""}`}>
                <div className="sidebar__wrapper">
                    <ul className="sidebar__list">
                        <Link to="/">
                            <li className="sidebar__listItem">
                                <RssFeed className="sidebar__icon" />
                                <span className="sidebar__listText">Feed</span>
                            </li>
                        </Link>
                        <Link to="/popular">
                            <li className="sidebar__listItem">
                                <Group className="sidebar__icon" />
                                <span className="sidebar__listText">
                                    Popular
                                </span>
                            </li>
                        </Link>
                        <Link to="/videos">
                            <li className="sidebar__listItem">
                                <PlayCircleOutline className="sidebar__icon" />
                                <span className="sidebar__listText">
                                    Videos
                                </span>
                            </li>
                        </Link>
                        <Link to="/images">
                            <li className="sidebar__listItem">
                                <Image className="sidebar__icon" />
                                <span className="sidebar__listText">Image</span>
                            </li>
                        </Link>
                        <Link to="/stared">
                            <li className="sidebar__listItem">
                                <Star className="sidebar__icon" />
                                <span className="sidebar__listText">
                                    Stared
                                </span>
                            </li>
                        </Link>
                        <Link to={`/friends/${user?._id || ""}`}>
                            <li className="sidebar__listItem">
                                <Event className="sidebar__icon" />
                                <span className="sidebar__listText">
                                    Friends
                                </span>
                            </li>
                        </Link>
                        <Link to={`/followers/${user?._id || ""}`}>
                            <li className="sidebar__listItem">
                                <WorkOutline className="sidebar__icon" />
                                <span className="sidebar__listText">
                                    Followers
                                </span>
                            </li>
                        </Link>
                        <Link to="/conversation">
                        <li className="sidebar__listItem">
                            <Chat className="sidebar__icon" />
                            <span className="sidebar__listText">Chat</span>
                        </li>
                        </Link>
                    </ul>
                    <button className="sidebar__button">Show more</button>
                    <hr className="sidebar__hr" />
                    <ul className="sidebar__friendList">
                        {friends?.map((user, index) => (
                            <Friend user={user} key={index} />
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
