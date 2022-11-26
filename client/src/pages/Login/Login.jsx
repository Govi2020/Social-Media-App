import { useContext, useRef } from "react";
import { useHistory } from "react-router";
import { CircularProgress } from "@material-ui/core";
import { AuthContext } from "../../contexts/AuthContext";
import { loginCall } from "../../apiCalls";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { isFetching, error, dispatch, user } = useContext(AuthContext);
    const history = useHistory();

    const handleSubmit = async(e) => {
        // console.clear();
        e.preventDefault();
        await loginCall({ email: email.current.value, password: password.current.value }, dispatch);
        history.push("/")
    };

    return (
        <div className="login">
            <div className="login__wrapper">
                <div className="login__right">
                    <h1 className="login__logo">Govi Social</h1>
                    <span className="login__description">
                        Connect with friends and the world around you on Govi
                        social.
                    </span>
                </div>
                <div className="login__left">
                    <form className="login__box" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="login__input"
                            required
                            placeholder="Enter your Email"
                            ref={email}
                        />
                        <input
                            type="password"
                            className="login__input"
                            required
                            minLength="6"
                            maxLength="30"
                            placeholder="Enter your Password"
                            ref={password}
                        />
                        <button className="login__button" disabled={isFetching}>{isFetching == true ? <CircularProgress color="white" size="25px"/>:"Log In"}</button>
                        <span className="login__forgotPassword">
                            Forgot Password
                        </span>
                        <Link to="/register" className="login__register" disabled={isFetching}>
                        {isFetching == true ? <CircularProgress color="white" size="25px"/>:"Create a new account"}
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
