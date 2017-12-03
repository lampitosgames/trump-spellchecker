import Twitter from 'twitter';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let listenForTweets = (username) => {
    return new Promise((resolve, reject) => {
        client.get('users/lookup', {screen_name: username})
            .then((users) => {
                //Set the userID
                let userID = users[0].id_str;
                let stream = client.stream('statuses/filter', {follow: userID});
                resolve(stream);
            })
            .catch((err) => reject(err));
    });
};

export default listenForTweets;
