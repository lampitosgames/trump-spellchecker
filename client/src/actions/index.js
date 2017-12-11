import actionTypes from './actionTypes';

//SETTINGS
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


//TWEETS
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


//SOCKET STATUS
export const updateSocketStatus = (newStatus) => {
    return {
        type: actionTypes.UPDATE_SOCKET_STATUS,
        status: newStatus
    };
}

//ERRORS
export const throwError = (error) => {
    return {
        type: actionTypes.THROW_ERROR,
        error: error
    };
}
export const removeError = (error) => {
    return {
        type: actionTypes.REMOVE_ERROR,
        error: error
    };
}
