import { GoogleApis } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

export class GmailService {

  constructor(private google: GoogleApis) {}

  public listLabels(auth: OAuth2Client): Promise<object> {
    const gmail = this.google.gmail({version: 'v1', auth});

    return new Promise(function(resolve, reject){
      gmail.users.labels.list({
        userId: 'me',
      }, (err, res) => {
        if (err) reject('The API returned an error: ' + err);
        if (res) resolve(res.data);
      });
    });
  }

}