import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import "./TopBar.css";
import { Link, useHistory } from "react-router-dom";
import { useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function TopBar() {
    const { user, dispatch } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const searchInput = useRef();
    const history = useHistory();

    const search = (e) => {
        e.preventDefault();
        history.push("/search/" + searchInput.current.value);
    };

    return (
        <div className="topbar__container">
            <div className="topbar__left">
                <Link
                    to="/"
                    className="topbar__logo"
                    style={{ textDecoration: "none" }}
                >
                    G Social
                </Link>
            </div>
            <div className="topbar__center">
                <form className="searchBar" onSubmit={search}>
                    <button style={{ border: "none", background: "none" }}>
                        <Search className="searchIcon" />
                    </button>
                    <input
                        type="text"
                        placeholder="Search for friend,Post or video"
                        className="searchInput"
                        ref={searchInput}
                    />
                </form>
            </div>
            <div className="topbar__right">
                {user ? (
                    <>
                        <div className="topbar__links">
                            <Link to="/conversation" className="topbar__link">Message</Link>
                            <Link to="/" className="topbar__link">Timeline</Link>
                        </div>
                        <div className="topbar__icons">
                            {/* <div className="topbar__iconItem">
                                <Person />
                                <div className="topbar__iconBadge">1</div>
                            </div> */}
                            <Link to="/conversation">
                                <div className="topbar__iconItem">
                                    <Chat />
                                    <div className="topbar__iconBadge">2</div>
                                </div>
                            </Link>
                            {/* <div className="topbar__iconItem">
                                <Notifications />
                                <div className="topbar__iconBadge">3</div>
                            </div> */}
                        </div>
                    </>
                ) : null}
                {user ? (
                    <button
                        className="rightbar__editBtn"
                        style={{
                            backgroundColor: "rgb(0, 104, 255)",
                            margin: "0",
                        }}
                        onClick={() => {
                            dispatch({ TYPE: "LOGIN_OUT" });
                        }}
                    >
                        Log Out
                    </button>
                ) : (
                    <button
                        className="rightbar__editBtn"
                        style={{
                            backgroundColor: "rgb(0, 104, 255)",
                            margin: "0",
                        }}
                        onClick={() => {
                            history.push("/login");
                        }}
                    >
                        Log In
                    </button>
                )}

                {user ? (
                    <Link to={`/profile/${user?.userAddress}`}>
                        <img
                            className="topbar__photo"
                            src={
                                user?.profilePicture !== ""
                                    ? user?.profilePicture
                                    : PF + "/user.png"
                            }
                            alt="your image"
                        />
                    </Link>
                ) : null}
            </div>
        </div>
    );
}
