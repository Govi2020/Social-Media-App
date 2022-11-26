import "./Dropdown.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { Share, Star, Delete } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import { deleteFile } from "../../../base";
import { Link } from "react-router-dom";

export default function Dropdown({
    style,
    postId,
    stared,
    postUserId,
    postSrcName,
    postType,
}) {
    const { user, dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isStared, setIsStared] = useState(stared);

    useEffect(() => {
        setIsStared(user?.staredPosts?.includes(postId));
    });

    const handleStar = async () => {
        try {
            const res = await axios.put("/api/posts/star/" + postId, {
                postId: postId,
                userId: user._id,
            });
            user?.staredPosts?.includes(postId)
                ? dispatch({ TYPE: "UNSTAR", payload: postId })
                : dispatch({ TYPE: "STAR", payload: postId });
            setIsStared(user?.staredPosts?.includes(postId));
            alert(res.data.message);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            console.log(postSrcName)
            await axios.delete("/api/posts/" + postId, {
                data: { userId: postUserId },
            });
            deleteFile(postSrcName, postType)
                .then(() => {
                    alert("deleted file");
                    setLoading(false);
                    window.location.reload();
                })
                .catch((err) => {
                    alert("error deleting file");
                });
            // alert(res.data.message);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="dropdown" style={style}>
            <ul className="dropdown__list">
                <li
                    className="dropdown__item"
                    onClick={() => {
                        alert("Feature not Implemented");
                    }}
                >
                    <div className="dropdown__icon">
                        <Share />
                    </div>
                    <div className="dropdown__title">Share</div>
                </li>
                {user ? (
                    <li className="dropdown__item" onClick={handleStar}>
                        <div className="dropdown__icon">
                            <Star />
                        </div>
                        <div className="dropdown__title">
                            {isStared ? "Un Star" : "Star"}
                        </div>
                    </li>
                ) : (
                    <Link to="/login" className="dropdown__item">
                        <li className="dropdown__item">
                            <div className="dropdown__icon">
                                <Star />
                            </div>
                            <div className="dropdown__title">
                                Login In to Star
                            </div>
                        </li>
                    </Link>
                )}
                {postUserId && postUserId === user?._id ? (
                    <li className="dropdown__item" onClick={handleDelete}>
                        <div className="dropdown__icon">
                            {loading ? <CircularProgress /> : <Delete />}
                        </div>
                        <div className="dropdown__title">Delete</div>
                    </li>
                ) : null}
            </ul>
        </div>
    );
}
