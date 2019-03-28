import fs = require('fs');
import { OAuth2Client } from 'google-auth-library';
import uuidv4 from 'uuid/v4'
import { errorConfig } from '../../config';
import { NextFunction } from 'connect';

export class GoogleOAuthService {

    constructor(private config: OAuthProviderConfig) {}

    private oAuth2Client = new OAuth2Client(
        this.config.CLIENT_ID, 
        this.config.CLIENT_SECRET, 
        this.config.REDIRECT_URI
    );

    public checkGapiAuth(req: Express.Request, res: Express.Response, next: NextFunction) {
        var tokenUserAuthUID = req.cookies[this.config.CLIENT_COOKIE_NAME];

        if (tokenUserAuthUID != undefined && !Array.isArray(tokenUserAuthUID)) {
            this.checkForUsersToken(tokenUserAuthUID).then((authResp) => {
                res.locals.authResp = authResp
                next(); 
            }).catch((authErr) => res.apiError(authErr));
        } else {
            res.apiError(`${this.config.CLIENT_COOKIE_NAME} ${errorConfig.httpHeaderMissing}`)
        }
    }

    public checkForUsersToken(tokenUserAuthUID: string): Promise<OAuth2Client> {
        var _this = this;
        // Check if we have previously stored a token.
        return new Promise(function(resolve, reject){
            fs.readFile(`${_this.config.TOKEN_PATH}${tokenUserAuthUID}-${_this.config.TOKEN_FILENAME}`, function (err, token) {
                if (err) return reject(errorConfig.noTokenLoginReq);

                _this.oAuth2Client.setCredentials(JSON.parse(token.toString()));
                resolve(_this.oAuth2Client);
            });
        });
    }

    public getUserAuth2Url() {
        var authorizeUrl = this.oAuth2Client.generateAuthUrl({
            access_type: this.config.ACCESS_TYPE,
            scope: this.config.SCOPES
        });
        return authorizeUrl;
    }

    public getTokenFromCode(code: string): Promise<string> {
        var _this = this;
        return new Promise(function(resolve, reject){
            _this.oAuth2Client.getToken(code, function (err, token) {
                if (err) return reject(errorConfig.errorRetrievingToken + err);
                if (token) {
                    var userTokenRefUUID: string = uuidv4();
                    _this.oAuth2Client.setCredentials(token);
                    
                    fs.writeFile(`${_this.config.TOKEN_PATH}${userTokenRefUUID}-${_this.config.TOKEN_FILENAME}`, JSON.stringify(token), function (err) {
                        if (err)
                            reject(console.error(err));
                        console.log('Token stored to', `${_this.config.TOKEN_PATH}${userTokenRefUUID}-${_this.config.TOKEN_FILENAME}`);
                    });

                    resolve(userTokenRefUUID);
                }
                else
                    reject(errorConfig.noToken);
            });
        });
    }; 
}