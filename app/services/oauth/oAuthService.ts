import fs = require('fs');
import uuidv4 from 'uuid/v4';
import { errorConfig } from '../../config';
import { NextFunction } from 'connect';
import { Logger } from 'winston';

export abstract class OAuthService {
    private parentConfig: OAuthProviderConfig;
    private parentLogger: Logger;

    constructor(private _config: OAuthProviderConfig,
                private _logger: Logger) {
                    this.parentConfig = _config;
                    this.parentLogger = _logger;
                }

    public abstract getUserAuth2Url(): string;
    public abstract getTokenFromCode(code: string): Promise<string>;

    public checkOAuth(req: Express.Request, res: Express.Response, next: NextFunction) {
        const tokenUserAuthUID = req.cookies[this.parentConfig.CLIENT_COOKIE_NAME];

        if (tokenUserAuthUID !== undefined && !Array.isArray(tokenUserAuthUID)) {
            this.checkForUsersToken(tokenUserAuthUID).then((authResp) => {
                this.setResponseToken(res, authResp);
                next();
            }).catch((authErr) => res.apiError(authErr));
        } else {
            res.apiError(`${this.parentConfig.CLIENT_COOKIE_NAME} ${errorConfig.httpHeaderMissing}`);
        }
    }

    public checkForUsersToken(tokenUserAuthUID: string): Promise<object> {
        const _this = this;
        // Check if we have previously stored a token.
        return new Promise((resolve, reject) => {
            fs.readFile(`${_this.parentConfig.TOKEN_PATH}${tokenUserAuthUID}-${_this.parentConfig.TOKEN_FILENAME}`,
             (err, token) => {
                if (err) return reject(errorConfig.noTokenLoginReq);

                const parsedToken = JSON.parse(token.toString());
                this.parentLogger.info(`Next: OAuthService.checkForUsersToken: OAuth Credentials ` +
                                `set to token ${parsedToken}`);
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

            fs.writeFile(`${this.parentConfig.TOKEN_PATH}${tokenRefID}-${this.parentConfig.TOKEN_FILENAME}`,
                        JSON.stringify(tokenObj), (fsErr) => {
                if (fsErr) reject(fsErr);
                this.parentLogger.info(`OAuthService.getTokenFromCode: Token stored to ` +
                            `${this.parentConfig.TOKEN_PATH}${tokenRefID}-${this.parentConfig.TOKEN_FILENAME}`);
            });

            resolve(tokenRefID);
        } else reject(errorConfig.noToken);
    }

    protected setResponseToken(res: Express.Response, authResp) {
        res.locals.authResp = authResp;
    }
}
