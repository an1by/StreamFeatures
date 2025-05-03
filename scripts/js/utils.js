function parseJwt (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function extractGoalId(url) {
    const regex = /\/goal\/(\d+)(?=[/?]|$)/;
    const match = url.match(regex);
    return match ? Number.parseInt(match[1]) : null;
}

// For "OAuth2 token", "User token from widget url"
const extractToken = (url) => {
    const regex = /.*token=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
