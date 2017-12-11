import React, {Component} from 'react';
import {connect} from 'react-redux';

import viewTypes from '../actions/viewTypes';

import TweetHeader from './TweetHeader';
import TweetView from './views/TweetView';
import AboutView from './views/AboutView';
import SettingsView from './views/SettingsView';
import SocketStatus from './utilities/SocketStatus';
import ErrorList from './utilities/ErrorList';


class TweetTimeline extends Component {
    render() {
        //Select the view based on state
        let renderedView;
        if (this.props.currentView === viewTypes.TWEETS_VIEW) {
            renderedView = <TweetView />;
        } else if (this.props.currentView === viewTypes.ABOUT_VIEW) {
            renderedView = <AboutView />;
        } else if (this.props.currentView === viewTypes.SETTINGS_VIEW) {
            renderedView = <SettingsView />;
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
