import jwtDecode from "jwt-decode";
export function checkAuth() {
    const token = localStorage.getItem("token");

    let exp = false;
    if (!token) {
        return { decodedToken: null, expired: exp }
    }
    const decodedToken = jwtDecode(token);
    const bufferTime = 40 * 60; // time that the client can sit idle in s
    if (decodedToken.exp * 1000 <= Date.now() + bufferTime * 1000 || !token) {
        exp = true
    }
    return { decodedToken: decodedToken, expired: exp }
}

export function isAuthenticated() {
    const { decodedToken, expired } = checkAuth()
    return decodedToken && !expired
}

export function mapStatusToColor(status) {
    switch(status) {
        case "NEW":
            return "blue";
        case "IN_PROGRESS":
            return "orange";
        case "COMPLETED":
            return "green";
        case "CLOSED":
            return "red";
        default:
            return "blue";
    }
}

export function mapStatusToText(status) {
    switch (status) {
        case "NEW":
            return "New";
        case "IN_PROGRESS":
            return "In Progress";
        case "COMPLETED":
            return "Completed";
        case "CLOSED":
            return "Closed";
        default:
            return "New";
    }
}