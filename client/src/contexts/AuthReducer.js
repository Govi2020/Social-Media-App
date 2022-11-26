const AuthReducer = (state, action) => {
    switch (action.TYPE) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            };
            break;

        case "LOGIN_SUCCESS":
            localStorage.setItem(
                "user",
                JSON.stringify({
                    _id: action.payload._id,
                    email: action.payload.email,
                })
            );
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };
            break;

        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: true,
            };
            break;

        case "LOGIN_OUT":
            localStorage.removeItem('user');
            return {
                user: null,
                isFetching: false,
                error: false,
            };
            break;

        case "FOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: [...state.user.followings, action.payload],
                },
            };
        case "UNFOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(
                        (following) => following !== action.payload
                    ),
                },
            };

        case "UNSTAR":
            return {
                ...state,
                user: {
                    ...state.user,
                    staredPosts: state.user.staredPosts.filter(
                        (following) => following !== action.payload
                    ),
                },
            };
        case "STAR":
            return {
                ...state,
                user: {
                    ...state.user,
                    staredPosts: [...state.user.staredPosts, action.payload],
                },
            };
        case "UPDATE":
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                },
            };
        default:
            break;
    }
};

export default AuthReducer;
