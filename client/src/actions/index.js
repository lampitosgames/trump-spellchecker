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


//SOCKETS
export const addClientSocket = (socket) => {
    return {
        type: actionTypes.ADD_CLIENT_SOCKET,
        socket: socket
    };
}
export const updateSocketStatus = (newStatus) => {
    return {
        type: actionTypes.UPDATE_SOCKET_STATUS,
        status: newStatus
    };
}
export const listenToNewUsers = (userList) => {
    let userArray = userList.match(/(\w){3,15}/g);
    return {
        type: actionTypes.LISTEN_TO_NEW_USERS,
        userList: userArray
    };
}
export const listenWasSuccessful = (userList) => {
    return {
        type: actionTypes.LISTEN_WAS_SUCCESSFUL,
        userList: userList
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
