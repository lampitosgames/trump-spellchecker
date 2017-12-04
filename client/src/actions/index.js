import actionTypes from './actionTypes';

export const incrementCounter = () => {
    return {
        type: actionTypes.INCREMENT
    }
}

export const decrementCounter = () => {
    return {
        type: actionTypes.DECREMENT
    }
}

export const newTweet = (tweetData) => {
    console.dir(tweetData);
    return {
        type: actionTypes.NEW_TWEET,
        id: tweetData.tweet.id,
        text: tweetData.tweet.full_text ? tweetData.tweet.full_text : tweetData.tweet.text,
        checked: tweetData.checked,
        data: tweetData
    };
}

export const multipleNewTweets = (tweets) => {
    tweets = tweets.sort((a, b) => {
        let dateA = Date.parse(a.tweet.created_at);
        let dateB = Date.parse(b.tweet.created_at);
        return (dateA < dateB ? 1 : -1);
    });

    console.dir(tweets);

    let returnData = {
        type: actionTypes.NEW_TWEET_LIST,
        tweets: []
    };

    tweets.forEach((tweetData) => {
        returnData.tweets.push({
            id: tweetData.tweet.id,
            text: tweetData.tweet.full_text ? tweetData.tweet.full_text : tweetData.tweet.text,
            checked: tweetData.checked,
            data: tweetData
        });
    });

    returnData.tweets.reverse();

    return returnData;
}
