import "./PostInfo.css";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "timeago.js";
import { MoreVert } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import { AuthContext } from "../../contexts/AuthContext";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/SideBar";
import RightBar from "../../components/rightbar/RightBar";
import Comment from "../../components/Comment/Comment";
import axios from "axios";
import ShareButton from "../../components/post/shareButton/ShareButton";
import Dropdown from "../../components/post/dropdown/Dropdown";

export default function PostInfo({ onlineUsers }) {
    const { postId } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState();
    const [user, setUser] = useState();
    const { user: currentUser } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const VF = process.env.REACT_APP_PUBLIC_FOLDER_VIDEO;
    const [open, setOpen] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [reload, setReload] = useState(false);
    const description = useRef();

    useEffect(async () => {
        const res = await axios.get(`/api/posts/${postId}`);
        setPost(res.data);
        setLikes(res.data.likes.length);
        setIsLiked(res.data.likes.includes());
        setLoading(false);
    }, [postId, reload]);

    useEffect(async () => {
        const res = post?.userId
            ? await axios.get(`/api/users?userId=${post?.userId}`)
            : undefined;
        setUser(res?.data);
    }, [post?.userId]);

    const handleLike = async () => {
        try {
            await axios.put(`/api/posts/${post._id}/like`, {
                userId: currentUser._id,
            });
        } catch (err) {
            console.log(err);
        }

        setIsLiked(isLiked === true ? false : true);
        setLikes((like) => {
            return isLiked === false ? like + 1 : likes - 1;
        });
    };

    const opendropdown = () => {
        setOpen(!open);
    };

    const addComment = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/posts/comments", {
                description: description.current.value,
                postId: post?._id,
                userId: currentUser._id,
            });
            setReload(!reload);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <TopBar />
            <div
                className="postInfo"
                style={{ display: "flex", width: "100%" }}
            >
                <Sidebar />
                <div
                    className="postInfo__center"
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
                        <div className="post">
                            {open ? (
                                <Dropdown
                                    style={{
                                        opacity: "1",
                                        visibility: "visible",
                                        right: "-125",
                                    }}
                                    postId={post?._id}
                                    stared={user?.staredPosts?.includes(
                                        post?._id
                                    )}
                                />
                            ) : (
                                <Dropdown
                                    style={{
                                        opacity: "0",
                                        visibility: "hidden",
                                        right: "-125",
                                    }}
                                    postId={post?._id}
                                    stared={user?.staredPosts?.includes(
                                        post?._id
                                    )}
                                />
                            )}
                            <div className="post__wrapper">
                                <div className="post__top">
                                    <div className="post__topLeft">
                                        <Link
                                            to={`/profile/${user?.userAddress}`}
                                        >
                                            <img
                                                src={
                                                    user?.profilePicture !==
                                                        "" ||
                                                    user?.profilePicture
                                                        ? user?.profilePicture
                                                        : PF + "/user.png"
                                                }
                                                alt="your photo"
                                                className="post__profilePhoto"
                                            />
                                        </Link>
                                        <span className="post__userName">
                                            {user?.userName}
                                        </span>
                                        <span className="post__date">
                                            {format(post?.createdAt)}
                                        </span>
                                    </div>
                                    <div className="post__topRight">
                                        <MoreVert
                                            className="post__more"
                                            onClick={opendropdown}
                                        />
                                    </div>
                                </div>
                                <div className="post__center">
                                    <span className="post__text">
                                        {post?.description}
                                    </span>

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
                                    {/* <img
                                    className="post__image"
                                    src={PF + "/" + "ad.png"}
                                    alt=""
                                /> */}
                                </div>
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
                                        <span className="post__likeCounter">
                                            {likes} likes
                                        </span>
                                    </div>
                                    <div className="post__bottomRight">
                                        <div className="post__commentText">
                                            {post?.comments?.length} comments
                                        </div>
                                        <div className="post__share">
                                            <ShareButton />
                                        </div>
                                    </div>
                                </div>
                                {currentUser ? (
                                    <div className="share">
                                        <div className="share__wrapper">
                                            <form
                                                className="share__top"
                                                onSubmit={addComment}
                                            >
                                                <img
                                                    src={
                                                        user?.profilePicture !==
                                                        ""
                                                            ? user?.profilePicture
                                                            : PF + "/user.png"
                                                    }
                                                    alt="you profile picture"
                                                    className="share__profilePhoto"
                                                />
                                                <input
                                                    type="textarea"
                                                    placeholder={
                                                        "What you Think " +
                                                        currentUser?.userName +
                                                        "?"
                                                    }
                                                    className="share__input"
                                                    ref={description}
                                                />
                                                <button className="share__comment_btn">
                                                    Submit
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <h1
                                        style={{
                                            margin: "10px",
                                            marginTop: "38px",
                                            fontWeight: "lighter",
                                        }}
                                    >
                                        Please Log In to add Comment or Like
                                    </h1>
                                )}

                                <div className="postInfo__comment-container">
                                    {post?.comments?.map((comment) => (
                                        <Comment comment={comment} />
                                    ))}
                                    {/* <Comment />
                                <Comment />
                                <Comment /> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <RightBar onlineUsers={onlineUsers} />
            </div>
        </>
    );
}
