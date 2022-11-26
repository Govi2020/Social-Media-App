import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user: null,
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(async () => {
        if (localStorage.getItem("user")) {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                dispatch({ TYPE: "LOGIN_START" });
                const res = await axios.get("/api/users?userId=" + user._id);
                const data = res.data;
                dispatch({ TYPE: "LOGIN_SUCCESS", payload: data });
            } catch (err) {
                console.log(err);
                dispatch({ TYPE: "LOGIN_FAILURE" });
            }
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch: dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
