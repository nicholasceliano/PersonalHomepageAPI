import fs = require('fs');
import path = require('path');
import uuidv4 from 'uuid/v4';
import { errorConfig, webConfig } from '../../config';
import { NextFunction } from 'connect';
import { Logger } from 'winston';

export abstract class OAuthService {
	private parentConfig: OAuthProviderConfig;
	private parentLogger: Logger;

	constructor(
		private _config: OAuthProviderConfig,
		private _logger: Logger) {
		this.parentConfig = _config;
		this.parentLogger = _logger;
	}

	public abstract getUserAuth2Url(): string;
	public abstract getTokenFromCode(code: string): Promise<string>;

	public checkOAuth(req: Express.Request, res: Express.Response, next: NextFunction) {
		const tokenUserAuthUID = req.header(webConfig().oAuthIDHeaderName);

		if (tokenUserAuthUID !== undefined && !Array.isArray(tokenUserAuthUID)) {
			this.checkForUsersToken(tokenUserAuthUID).then((authResp) => {
				this.setResponseToken(res, authResp);
				next();
			}).catch((authErr) => res.apiError(authErr));
		} else {
			res.apiError(`${webConfig().oAuthIDHeaderName} ${errorConfig.httpHeaderMissing}`);
		}
	}

	public checkForUsersToken(tokenUserAuthUID: string): Promise<OAuthToken> {
		const _this = this;
		// Check if we have previously stored a token.
		return new Promise((resolve, reject) => {
			fs.readFile(path.join(global.appRoot, '..', `${_this.parentConfig.TOKEN_PATH}`,
											`${tokenUserAuthUID}-${_this.parentConfig.TOKEN_FILENAME}`), (err, token) => {
				if (err) return reject(errorConfig.noTokenLoginReq);

				const parsedToken: OAuthToken = JSON.parse(token.toString());

				if (parsedToken.expiry_date <= new Date().getTime()) {
					this.refreshToken(parsedToken).then((tokenRes) => {
						this.writeTokenToFile(tokenUserAuthUID, tokenRes)
						.then(() => resolve(tokenRes))
						.catch((writeErr) => reject(writeErr));
					}).catch((tokenErr) => reject(tokenErr));
				}

				this.parentLogger.info(`Next: OAuthService.checkForUsersToken: OAuth Credentials set to token ${parsedToken}`);
				resolve(parsedToken);
			});
		});
	}

	public createToken(tokenObj: any, err: any, resolve, reject) {
		if (err) return reject(errorConfig.errorRetrievingToken + err);
		if (tokenObj) {
			const tokenRefID: string = uuidv4();

			if (typeof tokenObj === 'string') {
				try {
					tokenObj = JSON.parse(tokenObj);
				} catch (e) {
					reject(e);
				}
			}

			if (!tokenObj.hasOwnProperty('access_token')) {
				reject(errorConfig.invalidToken);
			}

			if (!fs.existsSync(path.join(global.appRoot, '..', `${this.parentConfig.TOKEN_PATH}`))) { // creates folders if they dont exist
				fs.mkdirSync(path.join(global.appRoot, '..', `${this.parentConfig.TOKEN_PATH}`), { recursive: true });
			}

			const tokenJSON: OAuthToken = this.mapToOAuthToken(tokenObj);

			this.writeTokenToFile(tokenRefID, tokenJSON)
			.then(() => resolve(tokenRefID))
			.catch((writeErr) => reject(writeErr));
		} else reject(errorConfig.noToken);
	}

	protected abstract refreshToken(token: OAuthToken): Promise<OAuthToken>;

	protected setResponseToken(res: Express.Response, authResp: OAuthToken) {
		res.locals.authResp = authResp;
	}

	protected mapToOAuthToken(tokenObj: any) {
		return {
			access_token: tokenObj.access_token,
			expiry_date: tokenObj.expiry_date,
			refresh_token: tokenObj.refresh_token,
			scope: tokenObj.scope,
			token_type: tokenObj.token_type,
		} as OAuthToken;
	}

	private writeTokenToFile(tokenRefID: string, tokenJSON: OAuthToken): Promise<any> {
		const _this = this;
		return new Promise((resolve, reject) => {
			const pathLocation = path.join(global.appRoot, '..', `${_this.parentConfig.TOKEN_PATH}`,
											`${tokenRefID}-${_this.parentConfig.TOKEN_FILENAME}`);
			fs.writeFile(pathLocation, JSON.stringify(tokenJSON),
				(fsErr) => {
					if (fsErr) reject(fsErr);
					_this.parentLogger.info(`OAuthService.getTokenFromCode: Token stored to ${pathLocation}`);
					resolve();
			});
		});
	}
}
