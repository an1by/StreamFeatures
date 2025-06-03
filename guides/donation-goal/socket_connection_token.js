const extractToken = (url) => {
    const regex = /.*token=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
const token = extractToken(window.location.href);

const url = "https://www.donationalerts.com/api/v1/token/widget?" + new URLSearchParams({token}).toString();
const response = await fetch(url);
const accessToken = (await response.json()).data.token;

const userResponse = await fetch("https://www.donationalerts.com/api/v1/user/widget", {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
});
const userData = await userResponse.json();

userData.data.socket_connection_token
