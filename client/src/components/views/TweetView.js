import React, {Component} from 'react';
import {connect} from 'react-redux';

import Tweet from '../Tweet.js';

class TweetView extends Component {
    render() {
        let renderTweets = this.props.tweets.sort((a, b) => {
            let dateA = Date.parse(a.timestamp);
            let dateB = Date.parse(b.timestamp);
            return (dateA < dateB ? 1 : -1);
        }).map(tweet =>
            <Tweet key={tweet.id} tweetData={tweet}/>
        );
        return (
            <div className={"tweetView"}>
                {renderTweets}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {tweets: state.tweets.tweets};
}

export default connect(mapStateToProps)(TweetView);
