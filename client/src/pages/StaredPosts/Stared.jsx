import "./Stared.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/SideBar";
import RightBar from "../../components/rightbar/RightBar";
import Feed from "../../components/feed/Feed";

export default function Stared({onlineUsers}) {
    return (
        <>
            <TopBar />
            <div className="home-container">
                <Sidebar />
                <Feed stared/>
                <RightBar onlineUsers={onlineUsers}/>
            </div>
        </>
    );
}
