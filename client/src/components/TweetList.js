import React, {Component} from 'react';
import {connect} from 'react-redux';

import Tweet from './Tweet';

class TweetList extends Component {
    render() {
        let renderTweets = this.props.tweets.map(tweet =>
            <Tweet key={tweet.id} text={tweet.text}/>
        );
        return (
            <div>
                {renderTweets}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {tweets: state.tweets.tweets};
}

export default connect(mapStateToProps)(TweetList);
