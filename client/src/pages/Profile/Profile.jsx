import "./Profile.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { CircularProgress } from "@material-ui/core";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/SideBar";
import RightBar from "../../components/rightbar/RightBar";
import Feed from "../../components/feed/Feed";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const { userName } = useParams();

    useEffect(async () => {
        try {
            const res = await axios.get(`/api/users?userName=${userName}`);
            // console.clear();
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            alert("User not found 😥");
        }
    }, [userName]);

    return (
        <>
            <TopBar />
            <div className="profile" style={{ display: "flex", width: "100%" }}>
                <Sidebar />
                <div
                    className="profile__right"
                    style={
                        loading
                            ? {
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                              }
                            : null
                    }
                >
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <div className="profile__right-top">
                                <div className="profile__cover">
                                    <img
                                        src={
                                            user?.coverPicture
                                                ? user.coverPicture
                                                : PF + "/post/3.jpeg"
                                        }
                                        alt="profile cover image"
                                        className="profile__coverImage"
                                    />
                                    <img
                                        src={
                                            user?.profilePicture
                                                ? user.profilePicture
                                                : PF + "/user.png"
                                        }
                                        alt="profile photo image"
                                        className="profile__photoImage"
                                    />
                                </div>
                                <div className="profile__info">
                                    <h4 className="profile__info-userName">
                                        {user?.userName}
                                    </h4>
                                    <span className="profile__info-description">
                                        {user?.description}
                                    </span>
                                    <Link
                                        to={"/profile/" + user.userAddress}
                                        className="profile__info-description"
                                        style={{
                                            fontSize: "11pcx",
                                            color: "rgb(0, 110, 255)",
                                        }}
                                    >
                                        {user?.userAddress}
                                    </Link>
                                </div>
                            </div>
                            <div className="profile__right-bottom">
                                <Feed username={userName} />
                                <RightBar
                                    user={user != {} || user ? user : null}
                                    profile
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
