import "./Followers.css";
import RightBar from "../../components/rightbar/RightBar";
import TopBar from "../../components/topbar/TopBar";
import SideBar from "../../components/sidebar/SideBar";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function Followers({ friend, onlineUsers }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [followers, setFollowers] = useState(null);
    // const { user } = useContext(AuthContext);
    const { userId } = useParams();

    useEffect(() => {
        const getFollowers = async () => {
            try {
                const res = await axios.get(`/api/users/followers/${userId}`);
                // console.clear();
                setFollowers(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFollowers();
    }, [userId]);

    return (
        <>
            <TopBar />
            <div className="home-container">
                <SideBar />
                <div className="feed">
                    <h1 className="followers__Title">Followers</h1>
                    <div className="followers__users">
                        {followers?.map((follower) => {
                            return (
                                <Link
                                    to={`/profile/${follower?.userAddress}`}
                                    className="result__user"
                                >
                                    <img
                                        src={
                                            follower?.profilePicture
                                                ? follower.profilePicture
                                                : PF + "/user.png"
                                        }
                                        alt="user image"
                                        className="result__userImage"
                                    />
                                    <span className="result__userName">
                                        {follower.userName}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <RightBar onlineUsers={onlineUsers} />
            </div>
        </>
    );
}
