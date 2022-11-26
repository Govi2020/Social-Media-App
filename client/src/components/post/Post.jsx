import "./Post.css";
import { useState, useEffect, useContext } from "react";
import { MoreVert } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import Dropdown from "./dropdown/Dropdown";
import ShareButton from "./shareButton/ShareButton";

export default function Post({ post }) {
    // console.log("likes array is : ",post?.likes.length)
    const [likes, setLikes] = useState(post?.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const VF = process.env.REACT_APP_PUBLIC_FOLDER_VIDEO;
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        // console.clear();
        setIsLiked(post.likes.includes(currentUser?._id));
    }, [currentUser, post.likes]);

    useEffect(async () => {
        try {
            const res = await axios.get(`/api/users?userId=${post.userId}`);
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    }, [post.userId]);

    const opendropdown = () => {
        setOpen(!open);
    };

    const handleLike = async () => {
        try {
            await axios.put(`/api/posts/${post._id}/like`, {
                userId: currentUser?._id,
            });
        } catch (err) {
            console.log(err);
        }

        setIsLiked(isLiked === true ? false : true);
        setLikes((like) => {
            return isLiked === false ? like + 1 : likes - 1;
        });
    };
    return (
        <div className="post">
            {/* {open ? <Dropdown/> : null} */}
            {open ? (
                <Dropdown
                    style={{ opacity: "1", visibility: "visible" }}
                    postId={post._id}
                    stared={user?.staredPosts?.includes(post?._id)}
                    postUserId={post.userId}
                    postSrcName={post.name}
                    postType={post.srcType}
                />
            ) : (
                <Dropdown
                    style={{ opacity: "0", visibility: "hidden" }}
                    postId={post._id}
                    stared={user?.staredPosts?.includes(post?._id)}
                    postUserId={post.userId}
                    postSrcName={post.name}
                    postType={post.srcType}
                />
            )}
            <div className="post__wrapper">
                <div className="post__top">
                    <div className="post__topLeft">
                        <Link to={`/profile/${user?.userAddress}`}>
                            <img
                                src={
                                    user?.profilePicture
                                        ? user?.profilePicture
                                        : PF + "/user.png"
                                }
                                alt="your photo"
                                className="post__profilePhoto"
                            />
                        </Link>
                        <span className="post__userName">{user?.userName}</span>
                        <span className="post__date">
                            {format(post.createdAt)}
                        </span>
                    </div>
                    <div className="post__topRight">
                        <MoreVert
                            className="post__more"
                            onClick={opendropdown}
                        />
                    </div>
                </div>
                <Link to={"/post/" + post._id} style={{ cursor: "pointer" }}>
                    <div className="post__center">
                        <span className="post__text">{post?.description}</span>

                        {post?.srcType === "video" ? (
                            <video
                                src={post.src}
                                className="post__image"
                                controls
                            ></video>
                        ) : (
                            <img
                                className="post__image"
                                src={post?.src}
                                alt=""
                            />
                        )}
                    </div>
                </Link>
                <div className="post__bottom">
                    <div className="post__bottomLeft">
                        {currentUser ? (
                            <>
                                <img
                                    className="post__like"
                                    src="/assets/like.png"
                                    alt="like"
                                    onClick={handleLike}
                                />
                                <img
                                    className="post__like"
                                    src="/assets/heart.png"
                                    alt="give a heart"
                                />
                            </>
                        ) : null}
                        <span className="post__likeCounter">{likes} likes</span>
                    </div>
                    <div className="post__bottomRight">
                        <div className="post__commentText">
                            {post?.comments?.length} comments
                        </div>
                        <ShareButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

// http://localhost:3000/post/6134cf09956886038471255d
