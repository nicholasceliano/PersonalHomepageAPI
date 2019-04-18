import { GoogleApis, youtube_v3 } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

export class YoutubeService {

	constructor(private google: GoogleApis) {}

	public getSubscriptionVidoes(auth: OAuth2Client): Promise<object> {
		const _this = this;
		const youtube = this.google.youtube({version: 'v3', auth});

		return new Promise((resolve, reject) => {
			const subscriptionVideos: string[] = [];
			youtube.subscriptions.list({ mine: true, part: 'snippet', maxResults: 50 },
			(err, res) => {
				if (err) return reject(err);
				if (res && res.data.items) {
					const channelIds: string[] = [];
					res.data.items.forEach((item) => {
						if (item.snippet && item.snippet.resourceId && item.snippet.resourceId.channelId) {
							channelIds.push(item.snippet.resourceId.channelId);
						}
					});

					_this.GetUploadPlaylistIdsFromChannelIds(youtube, channelIds).then((playlistRes) => {
						_this.GetPlaylistItemsFromPlaylistIds(youtube, playlistRes).then((subscriptionPlaylistItems) => {
							const allPlaylistItems: YoutubePlaylistItem[] = [];
							subscriptionPlaylistItems.forEach((playlistItems) => {
								playlistItems.forEach((playlistItem) => {
									allPlaylistItems.push(playlistItem);
								});
							});

							resolve(allPlaylistItems.sortByFieldDesc('videoDate').slice(0, 50)); // only 50 most recent
						}).catch((playlistItemsErr) => reject(playlistItemsErr));
					}).catch((playlistErr) => reject(playlistErr));

				} else resolve(subscriptionVideos);
			});
		});
	}

	private GetUploadPlaylistIdsFromChannelIds(youtube: youtube_v3.Youtube, channelIds: string[]): Promise<string[]> {
		return new Promise((resolve, reject) => {
			youtube.channels.list({ id: channelIds.join(','), part: 'id' },
			(err, res) => {
				if (err) return reject(err);
				const uploadPlaylistIds: string[] = [];
				if (res && res.data.items) {
					res.data.items.forEach((item) => {
						if (item.id) {
							const uploadsId = `${item.id.substring(0, 1)}U${item.id.substring(2, item.id.length)}`;
							uploadPlaylistIds.push(uploadsId);
						} else reject(err);
					});
				}
				resolve(uploadPlaylistIds);
			});
		});
	}

	private GetPlaylistItemsFromPlaylistIds(youtube: youtube_v3.Youtube, playlistIds: string[]): Promise<YoutubePlaylistItem[][]> {
		const promises: Array<Promise<YoutubePlaylistItem[]>> = [];

		playlistIds.forEach((pId) => { // playlistItems 'id' parameter not working, so need to loop and use 'playlistId'
			promises.push(new Promise((resolve, reject) => {
				youtube.playlistItems.list({ playlistId: pId, part: 'snippet', maxResults: 10 },
				(err, res) => {
					const playlistItems: YoutubePlaylistItem[] = [];
					if (err) return reject(err);
					if (res && res.data.items) {
						res.data.items.forEach((item) => {
							if (item.snippet && item.snippet.thumbnails && item.snippet.resourceId) {
								playlistItems.push({
									channelTitle: item.snippet.channelTitle,
									thumbnail: item.snippet.thumbnails.default,
									videoDate: item.snippet.publishedAt ?
										new Date(item.snippet.publishedAt) : new Date(),
									videoDesc: item.snippet.description,
									videoId: item.snippet.resourceId.videoId,
									videoTitle: item.snippet.title,
								});
							}
						});
					}
					resolve(playlistItems);
				});
			}));
		});

		return Promise.all(promises);
	}
}
