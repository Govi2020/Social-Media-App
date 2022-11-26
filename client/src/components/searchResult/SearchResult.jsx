import "./SearchResult.css";
import Post from "../../components/post/Post";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export default function SearchResult() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { query } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [searchUserResults, setUserResults] = useState([]);
    const [searchPostResults, setPostResults] = useState([]);

    useEffect(async () => {
        try{
            const res = await axios.get("/api/users/query?q=" + query || " ");
            setUserResults(res.data.filter(user => user._id !== currentUser?._id));
        }catch(err){
            console.log(err);
        }

    }, [query]);

    useEffect(async () => {
        try{
            const res = await axios.get("/api/posts/query?q=" + query);
            setPostResults(res.data);
        }catch(err){
            console.log(err);
        }

    },[query])

    return (
        <div className="search__result">
            <div className="search__ResultsFound">
                {searchUserResults?.length} users found
            </div>
            <div className="search__userResults">
                {searchUserResults?.length > 0
                    ? searchUserResults.map((user) => {
                            return (
                                <Link
                                    to={`/profile/${user?.userAddress}`}
                                    className="result__user"
                                >
                                    <img
                                        src={
                                            user.profilePicture !== ""
                                                ? user.profilePicture
                                                : PF + "/user.png"
                                        }
                                        alt="user image"
                                        className="result__userImage"
                                    />
                                    <span className="result__userName">
                                        {user.userName}
                                    </span>
                                </Link>
                            );
                    })
                    : null}
            </div>
            <div className="search__ResultsFound">{searchPostResults?.length} posts found</div>
            <div className="search__postResults">
            {searchPostResults?.length > 0
                    ? searchPostResults.map((post) => {
                            return (
                                <Post post={post}/>
                            );
                    })
                    : null}

            </div>
            Result
        </div>
    );
}
