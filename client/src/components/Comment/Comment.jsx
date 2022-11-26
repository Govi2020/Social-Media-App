import './Comment.css'
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useState,useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import axios from 'axios';

export default function Comment({comment}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user: currentUser} = useContext(AuthContext);
    const [likes, setLikes] = useState(comment?.likes?.length || 0);
    const [user,setUser] = useState(null);

    useEffect(async () => {
        try {
            const res = await axios.get(`/api/users?userId=${comment.userId}`);
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    }, [comment.userId]);



    return (
        <div className="comment">
            <div className="comment__wrapper">
                <div className="comment__top">
                    <Link to={`/profile/${user?.userAddress}`}>
                        <img
                            src={user?.profilePicture ? user.profilePicture : PF + "/user.png"}
                            // src="assets/user.png"
                            alt="your photo"
                            className="comment__profilePhoto"
                        />
                    </Link>
                    <span className="comment__userName">{user?.userName}</span>
                    <span className="comment__date">{format(comment?.createdAt)}</span>
                </div>
                <div className="comment__center">
                    <span className="comment__text">{comment.description}</span>
                </div>
                <div className="comment__bottom">
                    <div className="comment__bottomLeft">

                    </div>
                    <div className="comment__bottomRight">
                    </div>
                </div>
            </div>
        </div>
    );
}
