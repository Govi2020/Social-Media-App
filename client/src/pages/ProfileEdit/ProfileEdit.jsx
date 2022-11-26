import "./ProfileEdit.css";
import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { CircularProgress } from "@material-ui/core";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/SideBar";
import RightBar from "../../components/rightbar/RightBar";
import Feed from "../../components/feed/Feed";
import { upload } from "../../base";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProfileEdit() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const history = useHistory();
    const { dispatch, user: currentUser } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [coverPic, setCoverPic] = useState(null);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [relationship, setRelationship] = useState("single");
    const [loading, setLoading] = useState("Update");
    const [from, setFrom] = useState(null);
    const [city, setCity] = useState(null);
    const { userId } = useParams();

    useEffect(async () => {
        try {
            const res = await axios.get(`/api/users?userId=${userId}`);
            // console.clear();
            setFrom(user?.from);
            setUser(res.data);
            setCity(user?.city);
            setName(user?.userName);
            setRelationship(user?.relationship);
            setDescription(user?.description);
        } catch (err) {
            alert("User not found 😥");
        }
    }, [userId, currentUser]);

    const updateProfile = async () => {
        let updateObj = {};
        if (relationship) {
            updateObj.relationship = relationship;
        }
        if (name) {
            updateObj.userName = name;
        }
        if (city) {
            updateObj.city = city;
        }
        if (from) {
            updateObj.from = from;
        }
        if (description) {
            updateObj.description = description;
        }
        if (profilePic != undefined || profilePic != null) {
            const fileName = `${Date.now()}_SocialMedia_Id_${Math.floor(
                Math.random() * 1000
            )}_${profilePic.name}`;
            // let data = new FormData();
            // data.append("name", fileName);
            // data.append("file", profilePic);
            setLoading("Uploading Profile Picture");
            // const u = await axios.post("/api/upload", data);
            const url = await upload(profilePic, fileName);
            updateObj.profilePicture = url;
        }
        if (coverPic != undefined || coverPic != null) {
            const fileName = `${Date.now()}_SocialMedia_Id_${Math.floor(
                Math.random() * 1000
            )}_${coverPic.name}`;
            // let data = new FormData();
            // data.append("name", fileName);
            // data.append("file", coverPic);
            const url = await upload(coverPic, fileName);
            updateObj.coverPicture = url;
        }
        try {
            setLoading("Updating...");
            const res = await axios.put("/api/users/" + user?._id, {
                ...updateObj,
                userId: currentUser?._id,
            });
            dispatch({ TYPE: "UPDATE", payload: updateObj });
            alert(res.data.message);
            history.push("/");
        } catch (err) {
            console.log(err);
            alert("Update profile failed 😢");
        }
    };

    return (
        <>
            <TopBar />
            <div className="profile" style={{ display: "flex", width: "100%" }}>
                <Sidebar />
                {user?._id === currentUser._id ? (

                <div className="profile__right">
                    <div className="profile__right-top">
                        <div className="profile__cover">
                            <img
                                src={
                                    coverPic
                                        ? URL.createObjectURL(coverPic)
                                        : PF + "/post/3.jpeg"
                                }
                                alt="profile cover image"
                                className="profile__coverImage"
                            />
                            <img
                                src={
                                    profilePic
                                        ? URL.createObjectURL(profilePic)
                                        : PF + "/user.png"
                                }
                                alt="profile photo image"
                                className="profile__photoImage"
                            />
                        </div>
                        <div className="profile__info">
                            <h4 className="profile__info-userName">
                                <input
                                    type="text"
                                    style={{
                                        height: "2rem",
                                        fontSize: "1.8rem",
                                        margin: "1rem",
                                    }}
                                    placeholder="Enter your Name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                            </h4>
                            <span className="profile__info-description">
                                <input
                                    type="text"
                                    placeholder="Enter your description"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="profile__right-bottom">
                        <div style={{ margin: "10px" }}>
                            <button className="choosepicbtn">
                                <label
                                    htmlFor="profilePic"
                                    style={{ cursor: "pointer" }}
                                >
                                    Chose your profile picture
                                </label>
                            </button>
                            <input
                                type="file"
                                name="profilePic"
                                id="profilePic"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    setProfilePic(e.target.files[0]);
                                }}
                                accept=".png,.jpeg,.jpg"
                            />
                        </div>
                        <div style={{ margin: "10px" }}>
                            <button className="choosepicbtn">
                                <label
                                    htmlFor="coverPic"
                                    style={{ cursor: "pointer" }}
                                >
                                    Chose your Cover picture
                                </label>
                            </button>
                            <input
                                type="file"
                                name="coverPic"
                                id="coverPic"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    setCoverPic(e.target.files[0]);
                                }}
                                accept=".png,.jpeg,.jpg"
                            />
                        </div>
                    </div>
                    <div className="rightbar__info">
                        <div className="rightbar__info-item">
                            <span className="rightbar__info-key">City</span>
                            <input
                                className="rightbar__info-value"
                                type="text"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                }}
                            />
                        </div>
                        <div className="rightbar__info-item">
                            <span className="rightbar__info-key">From</span>
                            <input
                                className="rightbar__info-value"
                                type="text"
                                value={from}
                                onChange={(e) => {
                                    setFrom(e.target.value);
                                }}
                            />
                        </div>
                        <div className="rightbar__info-item">
                            <span className="rightbar__info-key">
                                Relationship
                            </span>
                            <select
                                className="rightbar__info-value"
                                onChange={(e) => {
                                    setRelationship(e.target.value);
                                }}
                            >
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                            </select>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button
                            onClick={() => {
                                history.push("/");
                            }}
                            className="choosepicbtn"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={updateProfile}
                            className="choosepicbtn"
                        >
                            {loading !== "Update" ? (
                                <>
                                    <CircularProgress />
                                    {loading}
                                </>
                            ) : (
                                loading
                            )}
                        </button>
                    </div>
                </div>
                ): (<h1>You can Only Edit Your Profile</h1>)}
            </div>
        </>
    );
}
