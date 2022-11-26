import "./Share.css";
import {
    Cancel,
    EmojiEmotions,
    Label,
    PermMedia,
    Room,
} from "@material-ui/icons";
import { upload } from "../../base";
import { CircularProgress } from "@material-ui/core";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function Share() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const [file, setFile] = useState();
    const [loading, setLoading] = useState("Share");
    const description = useRef();

    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            description: description.current.value,
        };
        try {
            if (file != undefined) {
                const fileName = `${Date.now()}${user?.userAddress}${Math.floor(
                    Math.random() * 1000
                )}_${file.name}`;
                // let data = new FormData();
                // data.append("name", fileName);
                // data.append("file", file);
                setLoading("Uploading File");
                const url = await upload(file, fileName);
                newPost.src = url;
                const type =
                    fileName.endsWith(".jpg") ||
                    fileName.endsWith(".png") ||
                    fileName.endsWith(".jpeg")
                        ? "image"
                        : "video";
                console.log(type)
                newPost.srcType = type;
                newPost.name = fileName;
                // const u = await axios.post("/api/upload",data);
            }
            setLoading("Creating Post");
            const res = await axios.post("/api/posts/", newPost);
            setLoading("Share");
            window.location.reload();
        } catch (err) {
            console.log(err);
            setLoading("Share");
            alert("Sorry can't uploaded the post");
        }
    };

    return (
        <div className="share">
            <div className="share__wrapper">
                <ShareTop PF={PF} />
                <hr className="share__hr" />
                {/* {file && (

                )} */}
                {file?.type?.includes("image") ? (
                    <div className="share__image-container">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="image"
                            className="share__image"
                        />
                        <Cancel
                            className="share__cancel-image"
                            onClick={() => {
                                setFile(null);
                            }}
                        />
                    </div>
                ) : null}
                {!file?.type?.includes("image") &&
                file?.type?.includes("video") ? (
                    <div className="share__image-container">
                        <video
                            src={URL.createObjectURL(file)}
                            alt="image"
                            className="share__image"
                            controls
                        />
                        <Cancel
                            className="share__cancel-image"
                            onClick={() => {
                                setFile(null);
                            }}
                        />
                    </div>
                ) : null}
                <ShareBottom PF={PF} />
            </div>
        </div>
    );

    function ShareTop({ PF }) {
        return (
            <div className="share__top">
                <img
                    src={
                        user?.profilePicture
                            ? user.profilePicture
                            : PF + "/user.png"
                    }
                    alt="you profile picture"
                    className="share__profilePhoto"
                />
                <input
                    type="textarea"
                    placeholder={"whats in your mind " + user?.userName + "?"}
                    className="share__input"
                    ref={description}
                />
            </div>
        );
    }

    function ShareBottom() {
        return (
            <form className="share__bottom" onSubmit={submitHandler}>
                <div className="share__options">
                    <label htmlFor="file" className="share__option">
                        <PermMedia htmlColor="red" className="share__icon" />
                        <span className="share__optionText">
                            Photo or Video
                        </span>
                        <input
                            type="file"
                            id="file"
                            style={{ display: "none" }}
                            accept=".png,.jpeg,.jpg,.mp4"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>
                    <div className="share__option">
                        <Label htmlColor="blue" className="share__icon" />
                        <span className="share__optionText">Tag</span>
                    </div>
                    <div className="share__option">
                        <Room htmlColor="green" className="share__icon" />
                        <span className="share__optionText">Location</span>
                    </div>
                    <div className="share__option">
                        <EmojiEmotions
                            htmlColor="goldenrod"
                            className="share__icon"
                        />
                        <span className="share__optionText">Feelings</span>
                    </div>
                </div>
                <button
                    className="share__button"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    {loading !== "Share" ? (
                        <>
                            <CircularProgress style={{ width: "24px" }} />{" "}
                            {loading}
                        </>
                    ) : (
                        loading
                    )}
                </button>
            </form>
        );
    }
}
