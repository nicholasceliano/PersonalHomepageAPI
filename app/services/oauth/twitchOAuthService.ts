import { Logger } from 'winston';
import request = require('request');
import { OAuthService } from './oAuthService';

export class TwitchOAuthService extends OAuthService {

	constructor(
		private config: OAuthProviderConfig,
		private logger: Logger) {
		super(config, logger);
	}

	public getUserAuth2Url() {
		const url = `${this.config.URIS.TwitchAuthUri}/authorize?client_id=${this.config.CLIENT_ID}&redirect_uri=` +
			`${this.config.REDIRECT_URI}&response_type=code&scope=${this.config.SCOPES.join(' ')}`;
		return url;
	}

	public getTokenFromCode(code: string): Promise<string> {
		return new Promise((resolve, reject) => {
			request.post(`${this.config.URIS.TwitchAuthUri}/token?client_id=${this.config.CLIENT_ID}` +
				`&client_secret=${this.config.CLIENT_SECRET}&code=${code}` +
				`&grant_type=authorization_code&redirect_uri=${this.config.REDIRECT_URI}`,
				(err, res, body) => {
					this.createToken(body, err, resolve, reject);
				});
		});
	}

	protected mapToOAuthToken(tokenObj: any) {
		return {
			access_token: tokenObj.access_token,
			expiry_date: (new Date().getTime() + (tokenObj.expires_in * 1000)),
			refresh_token: tokenObj.refresh_token,
			scope: tokenObj.scope,
			token_type: tokenObj.token_type,
		} as OAuthToken;
	}

	protected refreshToken(token: OAuthToken): Promise<OAuthToken> {
		return new Promise((resolve, reject) => {
			request.post(`${this.config.URIS.TwitchAuthUri}/token?grant_type=refresh_token&` +
					`refresh_token=${token.refresh_token}&client_id=${this.config.CLIENT_ID}&client_secret=${this.config.CLIENT_SECRET}`,
			(err, res, body) => {
				if (err) reject(err);

				const refreshedToken = this.mapToOAuthToken(JSON.parse(body));

				resolve(refreshedToken);
			});
		});
	}
}
