import TopBar from "../../components/topbar/TopBar";
import Sidebar from "../../components/sidebar/SideBar";
import RightBar from "../../components/rightbar/RightBar";
import Feed from "../../components/feed/Feed";

export default function Videos({onlineUsers}) {
    return (
        <>
            <TopBar />
            <div className="home-container">
                <Sidebar />
                <Feed videos/>
                <RightBar onlineUsers={onlineUsers}/>
            </div>
        </>
    );
}
