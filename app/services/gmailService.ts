import { gmail_v1, GoogleApis } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import { errorConfig } from '../config';

export class GmailService {

	constructor(private google: GoogleApis) {}

	public updateEmailThreadAsRead(auth: OAuth2Client, emailId: string): Promise<object> {
		const gmail = this.google.gmail({version: 'v1', auth});

		return new Promise((resolve, reject) => {
			gmail.users.threads.modify({
				id: emailId,
				requestBody: {
					addLabelIds: [],
					removeLabelIds: ['UNREAD'],
				},
				userId: 'me',
			}, (err, res) => {
				if (err) return reject(err);

				if (res) {
					if (res.data.id === emailId) {
						resolve(res.data);
					} else {
						reject(errorConfig.backendError(res));
					}
				}
			});
		});
	}

	public getUnreadEmailThreads(auth: OAuth2Client): Promise<object> {
		const _this = this;
		const gmail = this.google.gmail({version: 'v1', auth});

		return new Promise((resolve, reject) => {
			gmail.users.messages.list({
				q: 'is:unread',
				userId: 'me',
			}, (err, res) => {
				if (err) return reject(err);
				if (res) {
					const distinctThreads: string[] = [];
					if (res.data.messages) {
						res.data.messages.forEach((msg) => {
							if (msg.threadId && !distinctThreads.includes(msg.threadId)) {
								distinctThreads.push(msg.threadId);
							}
						});

						_this.GetThreadsByThreadList(gmail, distinctThreads).then((threadResp) => {
							resolve(threadResp);
						}).catch((threadErr) => {
							reject(threadErr);
						});
					} else {
						resolve(distinctThreads);
					}
				}
			});
		});
	}

	private GetThreadsByThreadList(gmail: gmail_v1.Gmail, threads: string[]): Promise<object> {
		const _this = this;
		const promises: Array<Promise<{}>> = [];

		threads.forEach((thread) => {
			promises.push(new Promise((resolve, reject) => {
				gmail.users.threads.get({
					id: thread,
					userId: 'me',
				}, (err, res) => {
					if (err) return reject(err);
					if (res) resolve(_this.BuildGmailThreadResponse(res.data));
					else reject(err);
				});
			}));
		});

		return Promise.all(promises);
	}

	private BuildGmailThreadResponse(thread: gmail_v1.Schema$Thread): GmailThread {
		const gmailThread: GmailThread = {
			historyId: thread.historyId,
			id: thread.id,
			messages: [],
		};

		if (thread.messages) {
		thread.messages.forEach((m) => {
			const email: GmailEmail = { date: new Date() };

			email.snippet = m.snippet;
			if (m.payload && m.payload.headers) {
				m.payload.headers.forEach((h) => {
					if (h.name === 'From') email.from = h.value;
					if (h.name === 'Subject') email.subject = h.value;
					if (h.name === 'Date') email.date = h.value ? new Date(h.value) : new Date();
				});
			}
			gmailThread.messages.push(email);
		});
		}

		gmailThread.messages.sortByFieldDesc('date');

		return gmailThread;
	}
}
