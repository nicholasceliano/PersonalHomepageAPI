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
}
