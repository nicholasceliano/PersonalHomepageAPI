import { GoogleApis, youtube_v3 } from 'googleapis';
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
      var _this = this;
    const youtube = this.google.youtube({version:'v3', auth});

    return new Promise(function(resolve, reject){
        var subscriptionVideos:string[] = [];
        youtube.subscriptions.list({ mine: true, part: 'snippet', maxResults: 50 }, 
        (err, res) => {
            if (err) reject('The API returned an error: ' + err);
            if (res && res.data.items) {
                var channelIds: string[]= [];
                res.data.items.forEach(item => {
                    if (item.snippet && item.snippet.resourceId && item.snippet.resourceId.channelId)
                    channelIds.push(item.snippet.resourceId.channelId);
                });

                _this.GetUploadPlaylistIdsFromChannelIds(youtube, channelIds).then((playlistRes) => {
                    _this.GetPlaylistItemsFromPlaylistIds(youtube, playlistRes).then((subscriptionPlaylistItems) => {
                        var allPlaylistItems: YoutubePlaylistItem[] = [];
                        subscriptionPlaylistItems.forEach(playlistItems => {
                            playlistItems.forEach(playlistItem => {
                                allPlaylistItems.push(playlistItem);
                            });
                        });
                        
                        resolve(allPlaylistItems.sortByFieldAsc("videoDate").slice(0,50));//only return 50 more recent
                    }).catch((playlistItemsErr) => reject('The API returned an error: ' + playlistItemsErr));
                }).catch((playlistErr) => reject('The API returned an error: ' + playlistErr))

            } else resolve(subscriptionVideos);
        });
    });
  }

  public getRecommendedVidoes(auth: OAuth2Client): Promise<object> {
    const youtube = this.google.youtube({version:'v3', auth});

    return new Promise(function(resolve, reject){
        //reject("Not Implemented");
        youtube.activities.list({ mine: true, part: 'contentDetails' }, 
        (err, res) => {
            if (err) reject('The API returned an error: ' + err);
            if (res) {
                console.log(res.data);
                resolve(res.data);
            }
        });
    });
  }

  private GetUploadPlaylistIdsFromChannelIds(youtube: youtube_v3.Youtube, channelIds: string[]): Promise<string[]> {
    var promises:Promise<string>[] = [];

    channelIds.forEach(channelId => {
        promises.push(new Promise(function (resolve, reject) {
            youtube.channels.list({ id: channelId, part: 'contentDetails' },
            (err, res) => {
                if (err) reject('The API returned an error: ' + err); 
                if (res && res.data.items && res.data.items.length == 1 && res.data.items[0].contentDetails && 
                    res.data.items[0].contentDetails.relatedPlaylists && res.data.items[0].contentDetails.relatedPlaylists.uploads) {
                    var uploadPlaylistId:string = res.data.items[0].contentDetails.relatedPlaylists.uploads
                    resolve(uploadPlaylistId);
                }
                else reject('The API returned an error: ' + err);
            })
        }));    
    });

    return Promise.all(promises);
  }

  private GetPlaylistItemsFromPlaylistIds(youtube: youtube_v3.Youtube, playlistIds: string[]): Promise<YoutubePlaylistItem[][]> {
    var promises:Promise<YoutubePlaylistItem[]>[] = [];
      
    playlistIds.forEach(playlistId => {
        promises.push(new Promise(function (resolve, reject) {
            youtube.playlistItems.list({ playlistId: playlistId, part: 'snippet,contentDetails', maxResults: 10 },
            (err, res) => {
                var playlistItems:YoutubePlaylistItem[] = [];
                if (err) reject('The API returned an error: ' + err); 
                if (res && res.data.items) {
                    res.data.items.forEach(item => {
                        if (item.contentDetails && item.snippet && item.snippet.thumbnails) {
                            playlistItems.push({
                                videoId: item.contentDetails.videoId,
                                videoDate: item.contentDetails.videoPublishedAt ? new Date(item.contentDetails.videoPublishedAt) : new Date() ,
                                channelTitle: item.snippet.channelTitle,
                                videoTitle: item.snippet.title,
                                videoDesc: item.snippet.description,
                                thumbnail: item.snippet.thumbnails.default
                            });
                        }
                    });
                }
                resolve(playlistItems);
            })
        }));
    });

    return Promise.all(promises);
  }
}