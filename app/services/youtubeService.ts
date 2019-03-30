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
		const promises: Array<Promise<string>> = [];

		channelIds.forEach((channelId) => {
			promises.push(new Promise((resolve, reject) => {
				youtube.channels.list({ id: channelId, part: 'contentDetails' },
				(err, res) => {
					if (err) return reject(err);
					if (res && res.data.items && res.data.items.length === 1 && res.data.items[0].contentDetails &&
					res.data.items[0].contentDetails.relatedPlaylists &&
					res.data.items[0].contentDetails.relatedPlaylists.uploads) {
						const uploadPlaylistId: string = res.data.items[0].contentDetails.relatedPlaylists.uploads;
						resolve(uploadPlaylistId);
					} else reject(err);
				});
			}));
		});

		return Promise.all(promises);
	}

	private GetPlaylistItemsFromPlaylistIds(youtube: youtube_v3.Youtube, playlistIds: string[]): Promise<YoutubePlaylistItem[][]> {
		const promises: Array<Promise<YoutubePlaylistItem[]>> = [];

		playlistIds.forEach((pId) => {
			promises.push(new Promise((resolve, reject) => {
				youtube.playlistItems.list({ playlistId: pId, part: 'snippet,contentDetails', maxResults: 10 },
				(err, res) => {
					const playlistItems: YoutubePlaylistItem[] = [];
					if (err) return reject(err);
					if (res && res.data.items) {
						res.data.items.forEach((item) => {
							if (item.contentDetails && item.snippet && item.snippet.thumbnails) {
								playlistItems.push({
									channelTitle: item.snippet.channelTitle,
									thumbnail: item.snippet.thumbnails.default,
									videoDate: item.contentDetails.videoPublishedAt ?
										new Date(item.contentDetails.videoPublishedAt) : new Date(),
									videoDesc: item.snippet.description,
									videoId: item.contentDetails.videoId,
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
