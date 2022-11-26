import "./Ads.css";

export default function Ads({ target, image }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <>
            <a href={target} target="_blank" className="advertisement">
                <img
                    src={"https://cdn2.vectorstock.com/i/1000x1000/21/86/coffee-advertisement-realistic-composition-vector-20772186.jpg"}
                    alt="advertisement"
                    className="rightbar__ad"
                />
            </a>
        </>
    );
}
