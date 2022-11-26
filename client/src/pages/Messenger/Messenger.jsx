import Conversations from "../../components/Conversations/Conversations";
import Message from "../../components/Message/Message";
import ChatOnline from "../../components/ChatOnline/ChatOnline";
import TopBar from "../../components/topbar/TopBar";
import "./Messenger.css";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

export default function Messenger({ socket, onlineUsers, setOnlineUsers }) {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [sideClass, setSideClass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useContext(AuthContext);
    const scrollRef = useRef();

    useEffect(() => {
        // socket.current = io("ws://localhost:8080");
        if (socket && user) {
            socket?.current?.on("getMessage", (data) => {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: data.createdAt,
                });
            });
        }
    }, [socket, user]);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members?.includes(arrivalMessage.sender) &&
            setMessages((prev) => {
                return [...prev, arrivalMessage];
            });
    }, [arrivalMessage, currentChat]);

    // useEffect(() => {
    //     socket?.current?.emit("addUser", user._id);
    //     socket?.current?.on("getUsers", (users) => {
    //         console.log(users);
    //         setOnlineUsers(user.followings.filter(f => {
    //             return users.some(u => u.userId === f)
    //         }));
    //     });
    // }, [user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/api/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
                alert("Could not get Conversations 😢");
            }
        };
        getConversations();
    }, [user?._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`/api/messages/${currentChat._id}`);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
                alert("Could not get Messages");
            }
        };
        if (currentChat) {
            getMessages();
        }
    }, [currentChat?._id]);

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages ? messages : null]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user?._id,
            text: newMessage,
            conversationId: currentChat?._id,
        };
        const receiverId = currentChat?.members.find((m) => {
            return m !== user?._id;
        });
        console.log({
            senderId: user?._id,
            receiverId: receiverId,
            text: newMessage,
        });


        setLoading(true);
        
        socket.current.emit("sendMessage", {
            senderId: user?._id,
            receiverId: receiverId,
            text: newMessage,
        });
        try {
            const res = await axios.post("/api/messages", message);
            socket.current.emit();
            setLoading(false);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
            setLoading(false);
            alert("Could not send message");
        }
    };

    return (
        <>
            <TopBar />
            <div className="messenger">
                <div className={sideClass ? "chat__menu conversation-active" : "chat__menu"}>
                    <div className="chat__menu-wrapper">
                        <input
                            type="text"
                            placeholder="Search for Friends"
                            className="chat__menu-input"
                        />
                        {conversations?.map((conversation) => {
                            return (
                                <div
                                    onClick={() => {
                                        setCurrentChat(conversation);
                                    }}
                                >
                                    <Conversations
                                        conversation={conversation}
                                        currentUser={user}
                                        key={conversation._id}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div
                    className={
                        !sideClass
                            ? "sidebar__toggle-active sidebar__toggle"
                            : "sidebar__toggle"
                    }
                    onClick={() => {
                        setSideClass(!sideClass);
                    }}
                    style={{width:"max-content", height:"max-content","cursor":"pointer"}}
                >
                    {sideClass ? <ArrowBack /> : <ArrowForward />}{" "}
                    {sideClass ? "Show Conversations" : "Hide Conversations"}
                </div>
                <div className="chat__box">
                    <div className="chat__box-wrapper">
                        {currentChat ? (
                            <>
                                <div className="chat__box-top">
                                    {messages?.map((message) => {
                                        const isOwn =
                                            message?.sender === user._id
                                                ? true
                                                : false;
                                        return (
                                            <div ref={scrollRef}>
                                                <Message
                                                    message={message}
                                                    own={isOwn}
                                                    key={message._id}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="chat__box-bottom">
                                    <textarea
                                        className="chat__message-input"
                                        placeholder="Write Something....."
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                        }}
                                        value={newMessage}
                                    />
                                    <button
                                        className="chat__submit-button"
                                        onClick={handleSubmit}
                                    >
                                        {loading ? <CircularProgress/> : "Send"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="chat__noConversation">
                                Open a Conversations to start Chatting
                            </span>
                        )}
                    </div>
                </div>
                <div className="chat__online">
                    <div className="chat__online-wrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            setOnlineUsers={setOnlineUsers}
                            userId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
