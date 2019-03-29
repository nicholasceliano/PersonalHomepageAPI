import fs = require('fs');
import uuidv4 from 'uuid/v4';
import { errorConfig } from '../../config';
import { NextFunction } from 'connect';
import { OAuth2Client } from 'google-auth-library';
import { Logger } from 'winston';

export class GoogleOAuthService {

    private oAuth2Client = new OAuth2Client(
        this.config.CLIENT_ID,
        this.config.CLIENT_SECRET,
        this.config.REDIRECT_URI,
    );

    constructor(private config: OAuthProviderConfig,
                private logger: Logger) {}

    public checkGapiAuth(req: Express.Request, res: Express.Response, next: NextFunction) {
        const tokenUserAuthUID = req.cookies[this.config.CLIENT_COOKIE_NAME];

        if (tokenUserAuthUID !== undefined && !Array.isArray(tokenUserAuthUID)) {
            this.checkForUsersToken(tokenUserAuthUID).then((authResp) => {
                res.locals.authResp = authResp;
                next();
            }).catch((authErr) => res.apiError(authErr));
        } else {
            res.apiError(`${this.config.CLIENT_COOKIE_NAME} ${errorConfig.httpHeaderMissing}`);
        }
    }

    public checkForUsersToken(tokenUserAuthUID: string): Promise<OAuth2Client> {
        const _this = this;
        // Check if we have previously stored a token.
        return new Promise((resolve, reject) => {
            fs.readFile(`${_this.config.TOKEN_PATH}${tokenUserAuthUID}-${_this.config.TOKEN_FILENAME}`,
             (err, token) => {
                if (err) return reject(errorConfig.noTokenLoginReq);
                const parsedToken = JSON.parse(token.toString());
                this.logger.info(`Next: GoogleOAuthService.checkForUsersToken: OAuth Credentials` +
                                `set to token ${parsedToken}`);
                _this.oAuth2Client.setCredentials(parsedToken);
                resolve(_this.oAuth2Client);
            });
        });
    }

    public getUserAuth2Url() {
        const authorizeUrl = this.oAuth2Client.generateAuthUrl({
            access_type: this.config.ACCESS_TYPE,
            scope: this.config.SCOPES,
        });
        return authorizeUrl;
    }

    public getTokenFromCode(code: string): Promise<string> {
        const _this = this;
        return new Promise((resolve, reject) => {
            _this.oAuth2Client.getToken(code, (err, token) => {
                if (err) return reject(errorConfig.errorRetrievingToken + err);
                if (token) {
                    const userTokenRefUUID: string = uuidv4();
                    _this.oAuth2Client.setCredentials(token);

                    fs.writeFile(`${_this.config.TOKEN_PATH}${userTokenRefUUID}-${_this.config.TOKEN_FILENAME}`,
                                    JSON.stringify(token), (fsErr) => {
                        if (fsErr) reject(fsErr);
                        this.logger.info(`GoogleOAuthService.getTokenFromCode: Token stored to` +
                                    `${_this.config.TOKEN_PATH}${userTokenRefUUID}-${_this.config.TOKEN_FILENAME}`);
                    });

                    resolve(userTokenRefUUID);
                } else reject(errorConfig.noToken);
            });
        });
    }
}
