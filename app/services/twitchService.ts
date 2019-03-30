import request = require('request');

export class TwitchService {

	constructor(private config: OAuthProviderConfig) {}

	public getFollowedStreams(authJSON): Promise<TwitchStream[]> {
		return new Promise((resolve, reject) => {
			const httpOptions = {
				headers: {
					'Authorization': `OAuth ${authJSON.access_token}`,
					'Client-ID': this.config.CLIENT_ID,
				},
				url: `${this.config.URIS.TwitchAPIv5Uri}/streams/followed?limit=100`,
			};

			request.get(httpOptions, (err, res, body) => {
				if (err) return reject(err);
				const streams: TwitchStream[] = [];
				const respBody = JSON.parse(body);

				if (respBody.streams) {
					const streamResp: object[] = JSON.parse(body).streams;

					streamResp.forEach((s: any) => {
						streams.push({
							channelDisplayName: s.channel.display_name,
							channelLogo: s.channel.logo,
							channelName: s.channel.name,
							channelStatus: s.channel.status,
							game: s.game,
							viewers: s.viewers,
						} as TwitchStream);
					});
				}

				resolve(streams);
			});
		});
	}
}
