import Twitter from 'twitter';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

let client = new Twitter({consumer_key: process.env.TWITTER_CONSUMER_KEY, consumer_secret: process.env.TWITTER_CONSUMER_SECRET, access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY, access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET});

export const getRecentTweets = (username) => {
    return new Promise((resolve, reject) => {
        client.get('statuses/user_timeline', {
            screen_name: username,
            count: 25,
            exclude_replies: true,
            include_rts: true,
            tweet_mode: "extended"
        }).then((tweets) => {
            resolve(tweets);
        }).catch((err) => reject(err));
    })
}

export const listenForTweets = (username) => {
    return new Promise((resolve, reject) => {
        client.get('users/lookup', {screen_name: username}).then((users) => {
            //Set the userID
            let userID = users[0].id_str;
            let stream = client.stream('statuses/filter', {
                follow: userID,
                tweet_mode: "extended"
            });
            resolve(stream);
        }).catch((err) => reject(err));
    });
}

export const getFullTweet = (tweetID) => {
    return new Promise((resolve, reject) => {
        client.get('statuses/show', {
            id: tweetID,
            tweet_mode: "extended"
        }).then((tweet) => {
            resolve(tweet);
        }).catch((err) => reject(err));
    })
}
