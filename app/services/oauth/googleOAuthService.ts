import { OAuth2Client } from 'google-auth-library';
import { Logger } from 'winston';
import { OAuthService } from './oAuthService';

export class GoogleOAuthService extends OAuthService {

	private oAuth2Client = new OAuth2Client(
		this.config.CLIENT_ID,
		this.config.CLIENT_SECRET,
		this.config.REDIRECT_URI,
	);

	constructor(
		private config: OAuthProviderConfig,
		private logger: Logger) {
		super(config, logger);
	}

	public getUserAuth2Url() {
		const authorizeUrl = this.oAuth2Client.generateAuthUrl({
			access_type: this.config.ACCESS_TYPE,
			scope: this.config.SCOPES,
		});
		return authorizeUrl;
	}

	public getTokenFromCode(code: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.oAuth2Client.getToken(code, (err, token) => {
				this.createToken(token, err, resolve, reject);
			});
		});
	}

	protected setResponseToken(res: Express.Response, authResp: OAuthToken) {
		this.oAuth2Client.setCredentials(authResp);
		res.locals.authResp = this.oAuth2Client;
	}

	protected refreshToken(token: OAuthToken): Promise<OAuthToken> {
		return new Promise((resolve, reject) => {
			this.oAuth2Client.getTokenInfo(token.access_token).then((res) => {
				token.expiry_date = res.expiry_date; // google-auth-library auto refreshses tokens
													// so just need to update the expiry date of our local token for housekeeping

				resolve(token);
			}).catch((err) => reject(err));
		});
	}
}
