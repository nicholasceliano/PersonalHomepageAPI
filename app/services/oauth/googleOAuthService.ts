import fs = require('fs');
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import uuidv4 from 'uuid/v4'

export class GoogleOAuthService {

    constructor(private googleAuth: GoogleAuth,
        private config: OAuthProviderConfig) {}

    private oAuth2Client = new OAuth2Client(
        this.config.CLIENT_ID, 
        this.config.CLIENT_SECRET, 
        this.config.REDIRECT_URI
    );

    public checkForUsersToken(tokenUserAuthUID: string): Promise<OAuth2Client> {
        var _this = this;
        // Check if we have previously stored a token.
        return new Promise(function(resolve, reject){
            fs.readFile(`${_this.config.TOKEN_PATH}${tokenUserAuthUID}-${_this.config.TOKEN_FILENAME}`, function (err, token) {
                if (err)
                    reject("No Token file: Login Required.");
                else { 
                    _this.oAuth2Client.setCredentials(JSON.parse(token.toString()));
                    resolve(_this.oAuth2Client);
                }
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
                if (err)
                    reject(console.log('Error retrieving access token', err));
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
                    reject(console.log('Error: Token does not exist'));
            });
        });
    }; 
}