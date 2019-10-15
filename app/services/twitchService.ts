import request = require('request');
import { Logger } from 'winston';

export class TwitchService {

	private readonly pageLimit = 100;

	constructor(private config: OAuthProviderConfig, private logger: Logger) { }

	public getFollowedStreams(authJSON: OAuthToken): Promise<TwitchStream[]> {
		return new Promise((resolve, reject) => {
			this.getUsersFollowedToIds(authJSON).then((followedTo: string[]) => {
				const url = `/streams?user_id=${followedTo.join('&user_id=')}&first=${this.pageLimit}`;
				const httpOptions = this.buildTwitchHttpOptions(authJSON, url);

				request.get(httpOptions, (err, res, body) => {
					if (err) return reject(err);
					const streams: TwitchStream[] = [];
					const respBody = JSON.parse(body);
					const gameIds: string[] = [];
					const userIds: string[] = [];

					respBody.data.forEach((s: any) => {
						gameIds.push(s.game_id);
						userIds.push(s.user_id);

						streams.push({
							channelLogo: s.thumbnail_url,
							channelName: s.user_name,
							channelStatus: s.title,
							channelUserId: s.user_id,
							game: s.game_id,
							viewers: s.viewer_count,
						} as TwitchStream);
					});

					const getGameNames = this.getGamesByGameIds(authJSON, gameIds).then((games: TwitchGame[]) => {
						streams.forEach((s) => {
							const game = games.filter((e) => e.id === s.game)[0];
							s.game = game ? game.name : '';
						});
					});

					const getProfileImages = this.getTwitchUserInfoByIds(authJSON, userIds).then((users: TwitchUser[]) => {
						streams.forEach((s) => {
							s.channelLogo = users.filter((e) => e.id === s.channelUserId)[0].profileImageUrl;
						});
					});

					Promise.all([getGameNames, getProfileImages]).then(() => {
						resolve(streams);
					});
				});
			});
		});
	}

	public getAuthUsersTwitchInfo(authJSON: OAuthToken): Promise<TwitchAuthUser> {
		return new Promise((resolve, reject) => {
			const httpOptions = this.buildTwitchHttpOptions(authJSON, '/users');

			request.get(httpOptions, (err, res, body) => {
				if (err) return reject(err);
				const respBody = JSON.parse(body);

				resolve({
					id: respBody.data[0].id,
					name: respBody.data[0].display_name,
					token: authJSON.access_token,
				} as TwitchAuthUser);
			});
		});
	}

	private getUsersFollowedToIds(authJSON: OAuthToken): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.getAuthUsersTwitchInfo(authJSON).then((userInfo: TwitchUser) => {
				const httpOptions = this.buildTwitchHttpOptions(authJSON, `/users/follows?from_id=${userInfo.id}&first=${this.pageLimit}`);

				request.get(httpOptions, (err, res, body) => {
					if (err) return reject(err);
					const followedToIds: string[] = [];
					const respBody = JSON.parse(body);

					if (respBody.data.length > this.pageLimit) {
						this.logger.warn('Warning: More pages of followers');
					}

					respBody.data.forEach((follow) => {
						followedToIds.push(follow.to_id);
					});

					resolve(followedToIds);
				});
			});
		});
	}

	private getTwitchUserInfoByIds(authJSON: OAuthToken, userIds: string[]): Promise<TwitchUser[]> {
		const url = `/users?id=${userIds.join('&id=')}&limit=${this.pageLimit}`;

		return new Promise((resolve, reject) => {
			const httpOptions = this.buildTwitchHttpOptions(authJSON, url);

			request.get(httpOptions, (err, res, body) => {
				if (err) return reject(err);
				const users: TwitchUser[] = [];
				const respBody = JSON.parse(body);

				respBody.data.forEach((user) => {
					users.push({
						id: user.id,
						name: user.display_name,
						profileImageUrl: user.profile_image_url,
					} as TwitchUser);
				});

				resolve(users);
			});
		});
	}

	private getGamesByGameIds(authJSON: OAuthToken, gameIds: string[]): Promise<TwitchGame[]> {
		const distinctGameIds = gameIds.filter((e, i, self) => self.indexOf(e) === i);
		const url = `/games?id=${distinctGameIds.join('&id=')}`;

		return new Promise((resolve, reject) => {
			const httpOptions = this.buildTwitchHttpOptions(authJSON, url);

			request.get(httpOptions, (err, res, body) => {
				if (err) return reject(err);
				const games: TwitchGame[] = [];
				const respBody = JSON.parse(body);

				respBody.data.forEach((game) => {
					games.push({
						id: game.id,
						name: game.name,
					} as TwitchGame);
				});

				resolve(games);
			});
		});
	}

	private buildTwitchHttpOptions(authJSON: OAuthToken, url: string) {
		return {
			headers: {
				'Authorization': `Bearer ${authJSON.access_token}`,
				'Client-ID': this.config.CLIENT_ID,
			},
			url: `${this.config.URIS.TwitchNewAPIUri}${url}`,
		};
	}
}
