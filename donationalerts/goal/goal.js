class DonationAlerts {
    constructor() {
        this.accessToken = null;
        this.userId = null;
        this.goalId = null;
        this.centrifuge = null;
        this.lastRaisedAmount = 0;
    }

    init = async (widgetUrl, authUrl) => {
        if (this.centrifuge) {
            this.centrifuge.disconnect();
        }

        // Widget API
        this.goalId = extractGoalId(widgetUrl);

        const widgetToken = extractToken(widgetUrl);
        this.accessToken = await this._getApiTokenFromWidgetToken(widgetToken);

        // OAuth API
        const oauthToken = extractToken(authUrl)
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
        this.centrifuge.setToken(socket_connection_token);
        this.centrifuge.connect();
    }

    subscribeGoal = (action) => {
        const channel = `$goal:goal_${this.userId}`
        this.centrifuge.subscribe(channel, ({data}) => {
            if (data.id !== this.goalId || data.raised_amount === this.lastRaisedAmount) {
                return;
            }
            this.lastRaisedAmount = data.raised_amount;

            action(data);
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
