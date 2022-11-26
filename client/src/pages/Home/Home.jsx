import "./Home.css";
import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/SideBar";
import RightBar from "../../components/rightbar/RightBar";
import Feed from "../../components/feed/Feed";

export default function Home({onlineUsers}) {
    return (
        <>
            <TopBar />
            <div className="home-container">
                <Sidebar />
                <Feed />
                <RightBar onlineUsers={onlineUsers} />
            </div>
        </>
    );
}
