import actionTypes from './actionTypes';

export const switchView = (newViewType) => {
    return {
        type: actionTypes.SWITCH_VIEW,
        newView: newViewType
    };
}

export const listenToNewUser = (newUser) => {
    return {
        type: actionTypes.LISTEN_TO_NEW_USER,
        newUser: newUser
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
