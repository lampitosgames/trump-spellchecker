import React, {Component} from 'react';
import {connect} from 'react-redux';

import viewTypes from '../actions/viewTypes';

import TweetHeader from './TweetHeader';
import TweetView from './TweetView';
import SocketStatus from './SocketStatus';
import ErrorList from './ErrorList';


class TweetTimeline extends Component {
    render() {
        //Select the view based on state
        let renderedView;
        if (this.props.currentView === viewTypes.TWEETS_VIEW) {
            renderedView = <TweetView/>;
        } else if (this.props.currentView === viewTypes.SETTINGS_VIEW) {
            renderedView = <div>test</div>;
        }
        return (
            <div className={"tweetTimeline"}>
                <TweetHeader />
                <SocketStatus />
                {renderedView}
                <ErrorList />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentView: state.settings.currentView
    };
}

export default connect(mapStateToProps)(TweetTimeline);
