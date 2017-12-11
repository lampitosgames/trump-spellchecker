import React, {Component} from 'react';
import {connect} from 'react-redux';

import viewTypes from '../actions/viewTypes';
import {switchView} from '../actions';

class TweetHeader extends Component {
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleClick(viewType) {
        this.props.switchView(viewType);
    }

    handleScroll(e) {
        let scrollTop = document.querySelector("html").scrollTop;
        if (scrollTop/1.5 > document.querySelector(".timelineHeaderTitle").offsetHeight) {
            document.querySelector(".timelineHeaderLinkList").style.position = "fixed";
        } else {
            document.querySelector(".timelineHeaderLinkList").style.position = "relative";
        }
    }

    render() {
        let curView = this.props.currentView;
        let tweetsClasses = "timelineHeaderLink" + ((curView === viewTypes.TWEETS_VIEW)
            ? " isActiveLink"
            : "");
        let aboutClasses = "timelineHeaderLink" + ((curView === viewTypes.ABOUT_VIEW)
            ? " isActiveLink"
            : "");
        let settingsClasses = "timelineHeaderLink" + ((curView === viewTypes.SETTINGS_VIEW)
            ? " isActiveLink"
            : "");

        return (
            <div className={"timelineHeader"}>
                <h1 className={"timelineHeaderTitle"}>
                    Trump Spellchecker
                    <p className={"timelineHeaderSubtitle"}><em>Real-time spellchecking our kindergartner-in-chief</em></p>
                </h1>
                <ul className={"timelineHeaderLinkList"}>
                    <li className={tweetsClasses} onClick={this.handleClick.bind(this, viewTypes.TWEETS_VIEW)}>
                        Tweets
                    </li>
                    <li className={aboutClasses} onClick={this.handleClick.bind(this, viewTypes.ABOUT_VIEW)}>
                        About
                    </li>
                    <li className={settingsClasses} onClick={this.handleClick.bind(this, viewTypes.SETTINGS_VIEW)}>
                        Settings
                    </li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {currentView: state.settings.currentView};
}

const mapDispatchToProps = (dispatch) => {
    return {
        switchView: (newView) => {
            dispatch(switchView(newView));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TweetHeader);
