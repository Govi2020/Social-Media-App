import "./RightBar.css";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Add, Chat, Edit, Remove } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import Ads from "../ads/Ads";
import Online from "../online/Online";
import axios from "axios";

export default function RightBar({ profile, user, onlineUsers }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    let [followed, setFollowed] = useState(
        currentUser?.followings.includes(user?._id) ? true : false
    );

    const HomeRightbar = () => {
        const [friends, setFriends] = useState([]);
        const [onlineFriends, setOnlineFriends] = useState([]);

        useEffect(() => {
            const getFriends = async () => {
                try {
                    if (currentUser) {
                        const res = await axios.get(
                            "/api/users/friends/" + currentUser?._id
                        );
                        setFriends(res.data);
                    }
                } catch (err) {
                    console.log(err);
                    alert("Failed to get friends");
                }
            };
            getFriends();
        }, [currentUser]);

        useEffect(() => {
            if (onlineUsers) {
                setOnlineFriends(
                    friends?.filter((f) => {
                        return onlineUsers?.includes(f._id);
                    })
                );
            }
        }, [friends, onlineUsers]);

        return (
            <>
                <Birthday PF={PF} />
                <Ads target="#" image="/ad.png" />
                <h4 className="rightbar__title">Online friends</h4>
                <ul
                    className="rightbar__friends"
                    style={
                        !onlineUsers
                            ? {
                                  justifyContent: "center",
                                  display: "flex",
                                  alignItems: "center",
                              }
                            : null
                    }
                >
                    {currentUser ? (
                        <>
                            {onlineUsers ? (
                                onlineUsers?.map((user, index) => (
                                    <Online user={user} key={index} />
                                ))
                            ) : (
                                <CircularProgress />
                            )}
                        </>
                    ) : (
                        <h2 style={{ fontWeight: "lighter" }}>Please Login</h2>
                    )}
                </ul>
            </>
        );
    };
    console.log(user);
    console.log(currentUser);

    const ProfileRightbar = () => {
        useEffect(() => {
            const getFriends = async () => {
                try {
                    const res = await axios.get(
                        `/api/users/friends/${user?._id}`
                    );
                    // console.clear();
                    setFriends(res.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getFriends();
        }, [user?._id]);

        useEffect(() => {
            setFollowed(
                currentUser?.followings.includes(user?._id) ? true : false
            );
        }, [currentUser, user]);

        const followHandler = async () => {
            try {
                if (followed) {
                    await axios.put(`/api/users/${user._id}/unfollow`, {
                        userId: currentUser._id,
                    });
                    dispatch({ TYPE: "UNFOLLOW", payload: user._id });
                } else {
                    await axios.put(`/api/users/${user._id}/follow`, {
                        userId: currentUser._id,
                    });
                    dispatch({ TYPE: "FOLLOW", payload: user._id });
                }
                setFollowed(!followed);
            } catch (err) {
                console.log(err);
            }
        };

        const newChatHandler = async () => {
            try {
                const res = await axios.post(`/api/conversations/`, {
                    senderId: currentUser?._id,
                    receiverId: user?._id,
                });
                if (res.data.type === "Object Exists") {
                    alert("Conversation already exists");
                } else {
                    alert("Chat room has been created successfully");
                }
            } catch (err) {
                console.log(err);

                alert("Sorry some error occurred cant create the chat room");
            }
        };

        function Info({ PF, user }) {
            return (
                <div className="rightbar__info">
                    <div className="rightbar__info-item">
                        <span className="rightbar__info-key">City</span>
                        <span className="rightbar__info-value">
                            {user?.city ? user.city : "none"}
                        </span>
                    </div>
                    <div className="rightbar__info-item">
                        <span className="rightbar__info-key">From</span>
                        <span className="rightbar__info-value">
                            {user?.from ? user.from : "none"}
                        </span>
                    </div>
                    <div className="rightbar__info-item">
                        <span className="rightbar__info-key">Relationship</span>
                        <span className="rightbar__info-value">
                            {user?.relationship ? user.relationship : "none"}
                        </span>
                    </div>
                </div>
            );
        }

        function Followings({ PF }) {
            return (
                <div className="rightbar__followings">
                    {friends.map((friend) => {
                        return (
                            <Link
                                to={`/profile/${friend.userAddress}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div className="rightbar__following">
                                    <img
                                        src={
                                            friend?.profilePicture
                                                ? friend.profilePicture
                                                : PF + "/user.png"
                                        }
                                        alt="friends photo"
                                        className="rightbar__followingImg"
                                    />
                                    <span className="rightbar__followingUserName">
                                        {friend.userName}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            );
        }
        return (
            <>
                <div
                    className="rightbar__bts"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}
                >
                    {user?._id !== currentUser?._id && currentUser ? (
                        <button
                            className="rightbar__followBtn"
                            onClick={followHandler}
                        >
                            {followed ? "unFollow" : "Follow"}
                            {followed ? <Remove /> : <Add />}
                        </button>
                    ) : null}
                    {user?._id === currentUser?._id || !user ? (
                        <>
                            <Link to={`/profile/${user?._id}/edit`}>
                                <button className="rightbar__editBtn">
                                    Edit
                                    <Edit />
                                </button>
                            </Link>
                        </>
                    ) : null}
                    {user?._id !== currentUser?._id && user && currentUser ? (
                        <>
                            <button
                                className="rightbar__editBtn"
                                onClick={newChatHandler}
                            >
                                Chat
                                <Chat />
                            </button>
                        </>
                    ) : null}
                </div>
                <div className="rightbar__userInfo">
                    <h4 className="rightbar__title">User Information</h4>
                    <Info PF={PF} user={user} />
                </div>
                <div className="rightbar__followings-container">
                    <h4 className="rightbar__title">User Friends</h4>
                    <Followings PF={PF} />
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        color: "rgb(11, 83, 187)",
                    }}
                >
                    <Link to={"/friends/" + user._id}>See all Friends</Link>
                    <Link to={"/followers/" + user._id}>See all Followers</Link>
                </div>
            </>
        );
    };
    function Birthday({ PF }) {
        return (
            <div className="rightbar__birthday">
                <img
                    src={PF + "/gift.png"}
                    alt="Happy Birthday"
                    className="birthday__image"
                />
                <span className="birthday__text">
                    <b>John Smith</b>
                    <b>and 3 others</b> has birthday today!
                </span>
            </div>
        );
    }

    return (
        <div
            className={profile ? "rightbar" : "rightbar rightbar-home"}
            style={profile ? { position: "initial", overflowX: "unset" } : null}
        >
            <div className="rightbar__wrapper">
                {profile ? ProfileRightbar() : HomeRightbar()}
            </div>
        </div>
    );
}
