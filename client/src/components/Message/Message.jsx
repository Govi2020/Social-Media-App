import './Message.css';
import {format } from "timeago.js" 

export default function Message({own,message}) {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images";

    return (
        <div className={own ? "message own" : "message"}>
            <div className="message__top">
                <img className="message__image" src={PF + '/user.png'} alt="Friends Image" />
                <p className="message__text">{message.text}</p>
            </div>
            <div className="message__bottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
}
