//Import tweet model
import Tweet from './tweetModel';

//Import networking helpers
import {listenForTweets, getRecentTweets, getFullTweet} from './twitter';
import {spellcheckText} from './languageTool';

export class Client {
    constructor(socket) {
        this.id = TweetState.nextClientID++;
        TweetState.clients[this.id] = this;

        socket.clientID = this.id;
        this.socket = socket;
        this.listeningTo = [];
    }

    EmitRecentTweets() {
        let recentTweets = [];
        //Loop through every username and add their tweets to the list
        this.listeningTo.forEach(user => {
            if (TweetState.tweets[user] == undefined) {
                return;
            }
            recentTweets = [
                ...recentTweets,
                ...TweetState.tweets[user].tweetList
            ];
        });
        //Emit all recent tweets
        this.socket.emit('recentTweets', recentTweets.map(tweet => tweet.getData()));
        return this;
    }

    ListenTo(username) {
        if (this.listeningTo.indexOf(username) == -1) {
            this.listeningTo.push(username);
        }
        return this;
    }
    Ignore(username) {
        let ind = this.listeningTo.indexOf(username);
        if (ind != -1) {
            this.listeningTo.splice(ind, 1);
        }
        return this;
    }
}

export class TwitterUser {
    constructor(username) {
        //If a twitter user with the same username already exists, do nothing
        if (username in TweetState.tweets) {
            console.log("Tried to create twitter user " + username + " but they already exist");
            return;
        }
        //Put this user into state
        TweetState.tweets[username] = this;
        //User to listen to
        this.username = username;
        //Cached list of tweets from this user
        this.tweetList = [];
        //List of sockets listening to new tweets from this user
        this.listeners = [];
        //Retry timeout for connecting to a tweet stream
        this.retryTimeoutStarted = false;
        this.connectionTries = 0;

        this.FetchTweets().Listen();
    }

    FetchTweets() {
        //Clear tweet list before re-fetching
        this.tweetList = [];
        getRecentTweets(this.username).then((tweetData) => {
            if (tweetData == null) {
                return;
            }
            tweetData.forEach((tweet) => {
                let thisTweet = new Tweet(tweet);
                spellcheckText(thisTweet.text).then((checked) => {
                    thisTweet.addCheckData(JSON.parse(checked)).build();
                    this.tweetList.push(thisTweet);
                    this.listeners.forEach(cli => {
                        TweetState.clients[cli.clientID].EmitRecentTweets()
                    });
                }).catch((err) => this.HandleError("Error spellchecking tweet " + thisTweet.text, {source: "Exceeded maximum number of calls to the language API"}));
            });
        }).catch((err) => this.HandleError("Error getting recent tweets for " + this.username, err));
        return this;
    }

    Listen() {
        console.log("listening to " + this.username);
        let curUser = this;
        listenForTweets(this.username).then((tweetStream) => {
            tweetStream.on('data', (event) => {
                if (event.user.screen_name !== this.username) {
                    return;
                }

                getFullTweet(event.id_str).then((tweetData) => {
                    let thisTweet = new Tweet(tweetData);

                    spellcheckText(thisTweet.text).then((checked) => {
                        thisTweet.addCheckData(JSON.parse(checked)).build();
                        this.tweetList.push(thisTweet);
                        //Loop through all listening sockets and send them the new tweet
                        this.listeners.forEach(cli => cli.emit('newTweet', thisTweet.getData()));
                    }).catch((err) => this.HandleError("Error spellchecking tweet", err))

                }).catch((err) => this.HandleError("Could not get full tweet for " + this.username, err));
            });

            tweetStream.on('error', (err) => {
                this.HandleError("Couldn't get tweet stream for " + this.username, err);
                console.dir(JSON.stringify(err));
                if (!curUser.retryTimeoutStarted && curUser.connectionTries < 4) {
                    curUser.retryTimeoutStarted = true;
                    curUser.connectionTries++;
                    setTimeout(() => {
                        curUser.FetchTweets.bind(curUser)();
                        curUser.Listen.bind(curUser)();
                        curUser.retryTimeoutStarted = false;
                    }, 30000);
                }
            });
        }).catch((err) => {
            // this.HandleError("Couldn't get tweet stream for " + this.username, err);
        });

        return this;
    }

    //Add socket that will be emmitted to when new tweets are recieved
    AddSocketListener(socket) {
        for (let i=0; i<this.listeners.length; i++) {
            if (this.listeners[i] == socket) {
                return;
            }
        }
        this.listeners.push(socket);
        return this;
    }
    //Remove a listener
    RemoveSocketListener(socket) {
        let ind = this.listeners.indexOf(socket);
        if (ind != -1) {
            this.listeners.splice(ind, 1);
        }
        return this;
    }

    //Error handling.  Emits errors to listening clients
    HandleError(context, error) {
        console.log(context);
        console.error(error);
        let errorObject = {
            context: context,
            message: (error.source != undefined ? error.source : error)
        };
        //Emit the error to relevant clients
        this.listeners.forEach(cli => cli.emit('serverError', errorObject));
    }
}

//Add a twitter user
const AddTwitterUser = (username) => {
    if (username in TweetState.tweets) {
        return;
    }
    new TwitterUser(username);
}

//Called to listen to a specific twitter user
const ListenToUser = (username, socketClient) => {
    if (!(username in TweetState.tweets)) {
        AddTwitterUser(username);
    }
    TweetState.tweets[username].AddSocketListener(socketClient);
    TweetState.clients[socketClient.clientID]
        .ListenTo(username)
        .EmitRecentTweets();
}

//Called to remove the client from listening to a twitter user
const IgnoreUser = (username, socketClient) => {
    if (username in TweetState.tweets) {
        TweetState.tweets[username].RemoveSocketListener(socketClient);
    }
    TweetState.clients[socketClient.clientID]
        .Ignore(username)
        .EmitRecentTweets();
}

//Object where the keys are twitter usernames and the values are TwitterUser objects
let TweetState = {
    tweets: {},
    clients: {},
    TwitterUser,
    Client,
    nextClientID: 0,
    AddTwitterUser: AddTwitterUser,
    ListenToUser: ListenToUser,
    IgnoreUser: IgnoreUser
};

export default TweetState;
