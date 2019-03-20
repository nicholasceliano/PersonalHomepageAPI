import fs = require('fs');
import { GoogleAuth, OAuth2Client } from 'google-auth-library';

export class GoogleOAuthService {

    constructor(private googleAuth: GoogleAuth,
        private config: OAuthProviderConfig) {}

    private oAuth2Client = new OAuth2Client(
        this.config.CLIENT_ID, 
        this.config.CLIENT_SECRET, 
        this.config.REDIRECT_URI
    );

    public authorize(callback: Function) {
        var _this = this;
        // Check if we have previously stored a token.
        fs.readFile(this.config.TOKEN_PATH, function (err, token) {
            if (err)
                return console.log("No Token file: Login Required.");
            _this.oAuth2Client.setCredentials(JSON.parse(token.toString()));
            callback(_this.oAuth2Client);
        });
    }

    public getUserAuth2Url() {
        var authorizeUrl = this.oAuth2Client.generateAuthUrl({
            access_type: this.config.ACCESS_TYPE,
            scope: this.config.SCOPES
        });
        return authorizeUrl;
    }

    public getTokenFromCode(code: string) {
        var _this = this;
        this.oAuth2Client.getToken(code, function (err, token) {
            if (err)
                return console.error('Error retrieving access token', err);
            if (token)
                _this.oAuth2Client.setCredentials(token);
            else
                console.log('Error: Token does not exist');
            // Store the token to disk for later program executions
            fs.writeFile(_this.config.TOKEN_PATH, JSON.stringify(token), function (err) {
                if (err)
                    return console.error(err);
                console.log('Token stored to', _this.config.TOKEN_PATH);
            });
        });
    };

     //   public getContacts (auth: googleAuth.OAuth2Client) {
    //     const service = gapi.google.people({version: 'v1', auth});
    //     service.people.connections.list({ resourceName: 'people/me', personFields: 'names,emailAddresses' }, 
    //     (err, res) => {
    //       if (err) return console.error('The API returned an error: ' + err);
    //       if (res)
    //         console.log(res.data.connections);
    //     });
    //   }  
}
