import "./Search.css";
import RightBar from "../../components/rightbar/RightBar";
import TopBar from "../../components/topbar/TopBar";
import SideBar from "../../components/sidebar/SideBar";
import SearchResult from "../../components/searchResult/SearchResult";

export default function Search({onlineUsers}) {
    return (
        <>
        <TopBar/>
        <div className="search">
            <div className="search__wrapper">
                <div className="search__left">
                    <SideBar/>
                </div>
                <div className="search__center">
                    <SearchResult/>
                </div>
                <div className="search__right">
                    <RightBar onlineUsers={onlineUsers}/>
                </div>
            </div>
        </div>
        </>
    )
}
