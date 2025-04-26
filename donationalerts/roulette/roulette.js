class DonationAlerts {
    constructor() {
        this.accessToken = null;
        this.userId = null;
        this.centrifuge = null;
    }

    init = async (widgetToken, oauthToken) => {
        if (this.centrifuge) {
            this.centrifuge.disconnect();
        }

        // Widget API
        this.accessToken = await this._getApiTokenFromWidgetToken(widgetToken);

        // OAuth API
        const {id, socket_connection_token} = await this._getDonationUserInfo(oauthToken);
        this.userId = id;

        const {endpoint} = await this._getCentrifugeConfig();
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
                        // .then(response => response.channels)
                        .then(data => {
                            console.log(data)
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
        this.centrifuge.setToken(socket_connection_token);
        this.centrifuge.connect();
    }

    subscribeRoulette = () => {
        const channel = `$widgets:roulette_widgets_${this.userId}`
        this.centrifuge.subscribe(channel, ({data}) => {
            if (data.event !== "goal-state-update") {
                return;
            }
            const eventData = data.eventData;
            const state = eventData.rollingState;
            if (!state || state !== "result") {
                return;
            }

            Config.expressWebsocket.getWss().clients.forEach((client) => {
                client.send(JSON.stringify(eventData))
            })
        });
    }

    _getCentrifugeConfig = async () => {
        const response = await fetch("https://www.donationalerts.com/api/v1/env/front");
        const data = await response.json();
        return data.data.centrifugo;
    }

    _getDonationUserInfo = async (accessToken) => {
        const response = await fetch("https://www.donationalerts.com/api/v1/user/oauth", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        console.log(data);
        return data.data;
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

        console.log(body)

        return fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
    }

    _getApiTokenFromWidgetToken = async (token) => {
        const url = "https://www.donationalerts.com/api/v1/token/widget?" + new URLSearchParams({
            token
        }).toString();

        const response = await fetch(url, {
            method: "GET"
        });
        const data = await response.json();
        return data.data.token;
    }
}
