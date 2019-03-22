import { GoogleApis } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

export class YoutubeService {

  constructor(private google: GoogleApis) {}

  public getWatchlistVideos(auth: OAuth2Client): Promise<object> {
    //const youtube = this.google.youtube({version:'v3', auth});
    return new Promise(function(resolve, reject){
        reject("Youtube Watchlist API depricated");
        // youtube.playlistItems.list({ playlistId: 'WL', part: 'contentDetails' }, 
        // (err, res) => {
        //     if (err) reject('The API returned an error: ' + err);
        //     if (res) {//Cant get watch later playlist - https://developers.google.com/youtube/v3/revision_history#september-15-2016
        //         resolve(res.data);
        //     }
        // });
    });
  }

  public getSubscriptionVidoes(auth: OAuth2Client): Promise<object> {
    const youtube = this.google.youtube({version:'v3', auth});

    return new Promise(function(resolve, reject){
        reject("Not Implemented");
        // youtube.playlistItems.list({ playlistId: 'WL', part: 'contentDetails' }, 
        // (err, res) => {
        //     if (err) reject('The API returned an error: ' + err);
        //     if (res) {
        //         console.log(res.data);
        //         resolve(res.data);
        //     }
        // });
    });
  }
}