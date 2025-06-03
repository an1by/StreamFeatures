function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

class DonationAlerts {
    constructor(userToken, socketConnectionToken) {
        this.userToken = userToken;
        this.socketConnectionToken = socketConnectionToken;
        this.userId = parseJwt(socketConnectionToken).sub;

        this.accessToken = null;
        this.centrifuge = null;
    }

    init = async () => {
        if (this.centrifuge) {
            this.centrifuge.disconnect();
        }

        // Widget API
        this.accessToken = await this._getAccessToken(this.userToken);

        const {endpoint} = await this._getCentrifugeConfig();
        /*
        This part of code taken from https://github.com/StimulCross/donation-alerts
         */
        this.centrifuge = new Centrifuge(
            endpoint,
            {
                pingInterval: 15_000,
                ping: true,
                minRetry: 0,
                maxRetry: 30_000,
                websocket: WebSocket,
                onPrivateSubscribe: (ctx, callback) => {
                    this._subscribeRequest(ctx.data.channels, ctx.data.client)
                        .then(response => response.json())
                        .then(data => {
                            const channels = data.channels
                            callback({
                                status: 200,
                                data: {
                                    channels: channels.map(channel => ({
                                        channel: channel.channel,
                                        token: channel.token
                                    })),
                                },
                            });
                        })
                        .catch(e => console.error(e));
                }
            },
        );
        this.centrifuge.setToken(this.socketConnectionToken);
        this.centrifuge.connect();
    }

    subscribeGoals = (action) => {
        this.centrifuge.subscribe(`$goals:goal_${this.userId}`, ({data}) => {
            action(data);
        });
    }

    subscribeRoulette = (action) => {
        this.centrifuge.subscribe(`$widgets:roulette_widgets_${this.userId}`, ({data}) => {
            action(data);
        });
    }

    _getCentrifugeConfig = async () => {
        const response = await fetch("https://www.donationalerts.com/api/v1/env/front");
        const data = await response.json();
        return data.data.centrifugo;
    }

    _getAccessToken = async (token) => {
        const url = "https://www.donationalerts.com/api/v1/token/widget?" + new URLSearchParams({
            token
        }).toString();

        const response = await fetch(url, {
            method: "GET"
        });
        const data = await response.json();
        return data.data.token;
    }

    _subscribeRequest = (channels, clientId) => {
        const url = "https://www.donationalerts.com/api/v1/centrifuge/subscribe"
        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Authorization', `Bearer ${this.accessToken}`);
        headers.append('Content-Type', 'application/json');

        const body = {
            channels,
            client: clientId,
        };

        return fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
    }
}
