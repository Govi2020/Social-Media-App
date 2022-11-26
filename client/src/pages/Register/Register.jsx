import axios from "axios";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Register.css";

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordConfirm = useRef();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(user);
        // history.push("/");
        if (passwordConfirm.current.value !== password.current.value) {
            // passwordConfirm.current.setCustomValidity("password don't match");
            return alert("Password don't match");
        } else {
            const user = {
                userName: username.current.value,
                password,
                email: email.current.value,
                password: password.current.value,
            };
            const res = await axios
                .post("/api/auth/register", user)
                .then((responce) => {
                    if (responce.statusText == "ok") {
                        alert("Register Successful");
                    }else{
                        alert(responce.data.message)
                    }
                    console.log(responce);
                })
                .catch((err) => {
                    console.log(err);
                    // alert(err.data.message);
                });
            history.push("/login");
        }
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
                <form className="login__left" onSubmit={handleSubmit}>
                    <div className="login__box">
                        <input
                            type="text"
                            className="login__input"
                            required
                            placeholder="Enter your UserName"
                            ref={username}
                        />
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
                            placeholder="Enter your Password"
                            ref={password}
                            minLength="6"
                            maxLength="30"
                        />
                        <input
                            type="password"
                            className="login__input"
                            required
                            placeholder="Confirm your Password"
                            ref={passwordConfirm}
                            minLength="6"
                            maxLength="30"
                        />
                        <button className="login__button">Sign Up</button>
                        <Link style={{ textDecoration: "none" }} to="/login">
                            <button className="login__register">
                                Log Into Account
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
