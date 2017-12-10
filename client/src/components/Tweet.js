import React, {Component} from 'react';

import PlainText from './tweetComponents/plainText';
import TwitterLink from './tweetComponents/twitterLink';
import GrammarText from './tweetComponents/grammarText';

class Tweet extends Component {

    render() {
        let uniqueID = 0;
        let renderedString = this.props.tweetData.fullCheckedText.map((fragment) => {
            //If the string fragment is a link (# or @ or actual link), format it
            if (fragment.isLink) {
                return <TwitterLink key={uniqueID++} fragment={fragment} />;
            }
            //If the string fragment is a correction, format it
            if (fragment.isCorrection) {
                return <GrammarText key={uniqueID++} fragment={fragment} />;
            }
            return <PlainText key={uniqueID++} fragment={fragment} />;
        });
        return (
            <div className={"tweetWrapper tweetText"}>
                <div className={"tweetOuterContent"}>
                    <div className={"tweetContent"}>
                        <div className={"tweetHeader"}>
                            <a className={"accountGroup"} href={"https://twitter.com/" + this.props.tweetData.userScreenName} target="_blank">
                                <img src={this.props.tweetData.userImageLink} alt={"Account"} className={"accountPicture"} />
                                <span className={"accountName"}>{this.props.tweetData.userRealName}</span>
                                <span className={"accountUsername"}>{"@" + this.props.tweetData.userScreenName}</span>
                            </a>
                        </div>
                        <div className={"tweetText"}>
                            {renderedString}
                        </div>
                        <div className={"tweetFooter"}></div>
                    </div>
                </div>
            </div>
        )}
}

export default Tweet;
