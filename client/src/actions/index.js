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

export const newTweet = (tweet) => {
    return {
        type: actionTypes.NEW_TWEET,
        id: tweet.id,
        text: tweet.text ? tweet.text : tweet.full_text,
        data: tweet
    };
}

export const multipleNewTweets = (tweets) => {
    let returnData = {
        type: actionTypes.NEW_TWEET_LIST,
        tweets: []
    };

    tweets.forEach((tweet) => {
        returnData.tweets.push({
            id: tweet.id,
            text: tweet.text ? tweet.text : tweet.full_text,
            data: tweet
        });
    });

    returnData.tweets.reverse();

    return returnData;
}
