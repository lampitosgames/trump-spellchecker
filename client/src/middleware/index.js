const tweetMiddleware = store => next => action => {
    if (action.type === 'INCREMENT') {
        console.log("increment");
    }
    next(action);
}

const tweetMiddlewareTwo = store => next => action => {
    if (action.type === 'DECREMENT') {
        console.log("decrement");
    }
    next(action);
}

export default [
    tweetMiddleware,
    tweetMiddlewareTwo
]
