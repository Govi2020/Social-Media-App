import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { AuthContext } from "../../contexts/AuthContext";
import { CircularProgress } from "@material-ui/core";

export default function Feed({
    username,
    stared,
    popular,
    profileEdit,
    videos,
    images,
}) {
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(async () => {
        try {
            
            const res = username
                ? await axios.get(`/api/posts/profile/${username}`)
                : stared
                ? await axios.get(`/api/posts/stared/${user._id}`)
                : popular
                ? await axios.get(`/api/posts/popular`)
                : videos
                ? await axios.get(`/api/posts/videos`)
                : images
                ? await axios.get(`/api/posts/images`)
                : await axios.get(`/api/posts/timeline/${user._id}`);
                setLoading(false);
            // console.clear();
            // let body = await axios.get("/api/posts/profile/John");
            setPosts(res.data);
        } catch (err) {
            alert("Cant the get all posts");
        }
    }, [username, user?._id, user?.following, user?.followers, user?.staredPosts]);

    return (
        <div className="feed">
            <div className="feed__wrapper">
                {!username || username === user?.userName || !profileEdit || !user ? (
                    <Share />
                ) : null}
                {}
                <div
                    className="feed__posts-container"
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
                            {posts || posts?.length != 0
                                ? posts?.map((post, index) => {
                                    return post ? (
                                        <Post key={post._id} post={post} />
                                    ) : null;
                                })
                                : null}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
