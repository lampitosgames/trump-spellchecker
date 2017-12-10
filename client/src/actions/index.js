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
    return {
        type: actionTypes.NEW_TWEET,
        data: tweetData
    };
}

export const multipleNewTweets = (tweets) => {
    return {
        type: actionTypes.NEW_TWEET_LIST,
        tweets: tweets
    };
}
