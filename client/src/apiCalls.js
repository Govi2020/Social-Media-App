import axios from "axios";


export const loginCall = async (userCredentials,dispatch) => {
    dispatch({TYPE: 'LOGIN_START'});
    try {
        const response = await axios.post('/api/auth/login',userCredentials);
        dispatch({TYPE: 'LOGIN_SUCCESS',payload: response.data})
    } catch (error) {
        dispatch({TYPE: 'LOGIN_FAILURE',payload: error})
        alert("Login Failed")
    }
}