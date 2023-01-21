import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PostInfo from "./pages/PostInfo/PostInfo";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Search from "./pages/Search/Search";
import Stared from "./pages/StaredPosts/Stared";
import Videos from "./pages/Videos/Videos";
import Images from "./pages/Images/Images";
import Popular from "./pages/Popular/Popular";
import Followers from "./pages/Followers/Followers";
import Followings from "./pages/Followings/Followings";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";
import Messenger from "./pages/Messenger/Messenger";
import { io } from "socket.io-client";
import axios from "axios"

function App() {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_SERVER;
    useEffect(() => {
        if (user) {
            const res = io(process.env.REACT_APP_SOCKET_SERVER);
            setSocket({ current: res });
        }
    }, [user]);

    useEffect(() => {
        if (user && socket) {
            socket?.current?.emit("addUser", user?._id);
            socket?.current?.on("getUsers", (users) => {
                setOnlineUsers(
                    user.followings.filter((f) => {
                        return users.some((u) => u.userId === f);
                    })
                );
            });
        }
    }, [user,socket]);

    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route path="/register" exact>
                        {user ? <Redirect to="/" /> : <Register />}
                    </Route>

                    <Route path="/login" exact>
                        {user ? <Redirect to="/" /> : <Login />}
                    </Route>

                    <Route path="/profile/:userName" exact>
                        <Profile />
                    </Route>

                    <Route path="/profile/:userId/edit" exact>
                        {!user ? <Redirect to="/" /> : <ProfileEdit />}
                    </Route>

                    <Route path="/post/:postId" exact>
                        <PostInfo onlineUsers={onlineUsers} />
                    </Route>

                    <Route path="/search/:query" exact>
                        <Search onlineUsers={onlineUsers} />
                    </Route>

                    <Route path="/popular" exact>
                        <Popular onlineUsers={onlineUsers} />
                    </Route>

                    <Route path="/stared" exact>
                        {!user ? (
                            <Redirect to="/" />
                        ) : (
                            <Stared onlineUsers={onlineUsers} />
                        )}
                    </Route>

                    <Route path="/videos" exact>
                        <Videos onlineUsers={onlineUsers} />
                    </Route>

                    <Route path="/images" exact>
                        <Images onlineUsers={onlineUsers} />
                    </Route>

                    <Route path="/friends/:userId">
                        <Followings onlineUsers={onlineUsers} />
                    </Route>

                    <Route path="/followers/:userId">
                        {/* {user ? <Followers /> : <Register />} */}
                        <Followers onlineUsers={onlineUsers} />
                    </Route>

                    <Route path="/conversation">
                        {user ? (
                            <Messenger
                                socket={socket}
                                onlineUsers={onlineUsers}
                                setOnlineUsers={setOnlineUsers}
                            />
                        ) : (
                            <Register />
                        )}
                    </Route>

                    <Route path="/">
                        {user ? (
                            <Home onlineUsers={onlineUsers} />
                        ) : (
                            <Register />
                        )}
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
