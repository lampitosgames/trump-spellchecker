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
        text: tweet.text,
        data: tweet
    };
}
