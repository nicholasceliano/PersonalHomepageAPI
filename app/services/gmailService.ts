import { GoogleApis, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

export class GmailService {

  constructor(private google: GoogleApis) {}

  public getUnreadEmails(auth: OAuth2Client): Promise<object> {
    var _this = this;
    const gmail = this.google.gmail({version: 'v1', auth});

    return new Promise(function(resolve, reject){
      gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread'
      }, (err, res) => {
        if (err) reject('The API returned an error: ' + err);
        if (res) 
        {
          var distinctThreads:string[] = [];
          if (res.data.messages) {
            res.data.messages.forEach(msg => {
              if (msg.threadId && !distinctThreads.includes(msg.threadId)) {
                distinctThreads.push(msg.threadId)
              }
            });
            
            _this.GetThreadsByThreadList(gmail, distinctThreads).then((threadResp) => {
              resolve(threadResp);
            }).catch((threadErr) => {
              reject('The API returned an error: ' + threadErr);
            })
          } else {
            resolve(distinctThreads);
          }
        }
      });
    });
  }

  private GetThreadsByThreadList(gmail:gmail_v1.Gmail, threads:string[]): Promise<object> {
    var _this = this;
    var promises:Promise<{}>[] = [];
    
    threads.forEach(thread => {
      promises.push(new Promise((resolve, reject) => {
        gmail.users.threads.get({
          userId: 'me',
          id: thread
        }, (err, res) => {
          if (err) reject('The API returned an error: ' + err);
          if (res) resolve(_this.BuildGmailThreadResponse(res.data));
          else reject('The API returned an error: ' + err);
        });
      }))
    });

    return Promise.all(promises);
  }

  private BuildGmailThreadResponse(thread: gmail_v1.Schema$Thread): GmailThread {
    var gmailThread: GmailThread = {
      id: thread.id,
      historyId: thread.historyId,
      messages: []
    };
    
    if(thread.messages) {
      thread.messages.forEach(m => {
        var email: GmailEmail = { date: new Date() };
        
        email.snippet = m.snippet;
        if(m.payload && m.payload.headers){
          m.payload.headers.forEach(h => {
            if (h.name == "From") email.from = h.value;
            if (h.name == "Subject") email.subject = h.value;
            if (h.name == "Date") email.date = h.value ? new Date(h.value) : new Date();
          });
        }
        gmailThread.messages.push(email);
      });
    }

    gmailThread.messages.sortByFieldAsc("date");
    
    return gmailThread;
  }
}