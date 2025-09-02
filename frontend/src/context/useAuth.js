const getUser = () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
};
const setUser = (user) => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
    else {
        localStorage.removeItem("user");
    }
};
const isLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
};
const setToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
    }
    else {
        localStorage.removeItem("token");
    }
};
const getToken = () => {
    return localStorage.getItem("token");
};
const logout = () => {
    // Remove only sensitive auth info
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    //  Keep chosenAlignment, lastPrediction, predictionHistory safe
    window.location.href = "/login";
};
const auth = {
    getUser,
    setUser,
    isLoggedIn,
    setToken,
    getToken,
    logout,
};
export default auth;
