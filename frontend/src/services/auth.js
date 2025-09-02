export function saveAuth(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}
export function getToken() {
    return localStorage.getItem("token");
}
export function getUser() {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
}
export function isLoggedIn() {
    return !!getToken();
}
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
